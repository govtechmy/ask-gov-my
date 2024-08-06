from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from .models import Question, Agency, Topic
from .serializers import QuestionSerializer, AgencySerializer, TopicSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Sum
from .elasticsearch_client import client
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class CompletedQuestionListView(generics.ListCreateAPIView):
    queryset = Question.objects.filter(state='completed')
    serializer_class = QuestionSerializer

class AllQuestionListView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuestionDetailView(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class AgencyListView(generics.ListAPIView):
    queryset = Agency.objects.all()
    serializer_class = AgencySerializer

class TopicListView(generics.ListAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

class SubmitQuestionView(APIView):
    def post(self, request):
        data = request.data.get('data')
        serializer = QuestionSerializer(data=data)
        if serializer.is_valid():
            question = serializer.save()
            
            document = serializer.data

            document['agency'] = {
                "id": "",
                "name": "",
                "acronym": "",
                "name_ms": ""
            }
            
            client.index(
                index='questions',
                id=str(question.id),
                document=document
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionsByAgencyView(APIView):
    def get(self, request, agency_id):
        agency = get_object_or_404(Agency, pk=agency_id)
        questions = Question.objects.filter(agency=agency, state='completed')
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)


class UserAgencyQuestionsView(APIView):
    def get(self, request, agency_id):
        agency = get_object_or_404(Agency, id=agency_id)
        questions = Question.objects.filter(agency=agency, state='completed')
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SubmitAnswerView(APIView):
    def post(self, request, question_id):
        data = request.data.get('data')
        if not data:
            return Response({"detail": "Data is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        answer = data.get('answer')
        if not answer:
            return Response({"detail": "Answer is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        attachments = data.get('attachments', [])
        
        try:
            question = Question.objects.get(id=question_id)
            question.answer = answer
            question.state = 'completed'
            question.attachments = attachments
            question.answered_date = timezone.now()
            question.save()
            
            client.update(
                index='questions',
                id=str(question.id),
                body={
                    "doc": {
                        "answer": answer,
                        "state": "completed",
                    }
                }
            )
            
            return Response({"detail": "Answer submitted successfully"}, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response({"detail": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserAgencyTopicsView(APIView):
    def get(self, request, agency_id):
        agency = get_object_or_404(Agency, id=agency_id)
        topics = Topic.objects.filter(agency=agency)
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddTopicView(APIView):
    def post(self, request, agency_id):
        agency = get_object_or_404(Agency, id=agency_id)
        title = request.data.get('title')
        title_ms = request.data.get('title_ms')
        if not title:
            return Response({"detail": "Title is required"}, status=status.HTTP_400_BAD_REQUEST)
        topic = Topic.objects.create(title=title, title_ms=title_ms, agency=agency)
        serializer = TopicSerializer(topic)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LikeQuestionView(APIView):
    def post(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
            question.likes += 1
            question.save()
            client.update(
                index='questions',
                id=str(question.id),
                body={
                    "doc": {
                        "likes": question.likes
                    }
                }
            )
            serializer = QuestionSerializer(question)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

class DislikeQuestionView(APIView):
    def post(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
            question.dislikes += 1
            question.save()
            client.update(
                index='questions',
                id=str(question.id),
                body={
                    "doc": {
                        "dislikes": question.dislikes
                    }
                }
            )
            serializer = QuestionSerializer(question)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

class AssignAgencyToQuestionView(APIView):
    def post(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return Response({"detail": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        agency_id = request.data.get('agency_id')
        if not agency_id:
            return Response({"detail": "Agency ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            agency = Agency.objects.get(id=agency_id)
        except Agency.DoesNotExist:
            return Response({"detail": "Agency not found"}, status=status.HTTP_404_NOT_FOUND)

        question.agency = agency
        question.save()

        agency_data = {
            "id": agency.id,
            "name": agency.name,
            "acronym": agency.acronym,
            "name_ms": agency.name_ms
        }

        client.update(
            index='questions',
            id=str(question.id),
            body={
                "doc": {
                    "agency": agency_data
                }
            }
        )

        serializer = QuestionSerializer(question)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddAgencyView(APIView):
    def post(self, request):
        name = request.data.get('name')
        name_ms = request.data.get('name_ms')
        acronym = request.data.get('acronym')
        logo_url = request.data.get('logo_url')

        if not name or not name_ms:
            return Response({"detail": "Both name and name_ms are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        agency = Agency.objects.create(
            name=name,
            name_ms=name_ms,
            acronym=acronym,
            logo_url=logo_url 
        )
        serializer = AgencySerializer(agency)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TrendingAgenciesView(APIView):
    def get(self, request):
        agencies = Agency.objects.annotate(total_likes=Sum('question__likes')).order_by('-total_likes')
        agencies = agencies.filter(total_likes__isnull=False)
        serializer = AgencySerializer(agencies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdateAgencyView(APIView):
    def put(self, request, pk):
        agency = get_object_or_404(Agency, pk=pk)
        data = request.data
        
        agency.name = data.get('name', agency.name)
        agency.name_ms = data.get('name_ms', agency.name_ms)
        agency.acronym = data.get('acronym', agency.acronym)
        
        if 'logo_url' in data:
            agency.logo_url = data['logo_url']
        
        agency.save()

        questions = Question.objects.filter(agency=agency)
        for question in questions:
            client.update(
                index='questions',
                id=str(question.id),
                body={
                    "doc": {
                        "agency.id": agency.id,
                        "agency.name": agency.name,
                        "agency.acronym": agency.acronym,
                        "agency.name_ms": agency.name_ms,
                    }
                }
            )

        serializer = AgencySerializer(agency)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ChangeAdminIsOpenView(APIView):
    def post(self, request, question_id):
        question = get_object_or_404(Question, id=question_id)
        question.admin_isopen = True
        question.save()
        return Response({"detail": "Admin isopen changed to true"}, status=status.HTTP_200_OK)

class ChangeStaffIsOpenView(APIView):
    def post(self, request, question_id):
        question = get_object_or_404(Question, id=question_id)
        question.staff_isopen = True
        question.save()
        return Response({"detail": "Staff isopen changed to true"}, status=status.HTTP_200_OK)

class SaveDraftQuestionView(APIView):
    def post(self, request, question_id):
        data = request.data.get('data')
        if not data:
            return Response({"detail": "Data is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        attachments = data.get('attachments', [])
        
        try:
            question = Question.objects.get(id=question_id)
            question.state = 'draft'
            question.attachments = attachments
            question.save()
            
            return Response({"detail": "Question saved as draft successfully"}, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response({"detail": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
        
class MarkQuestionAsSpamView(APIView):
    def post(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
            question.state = 'spam'
            question.save()
            return Response({"detail": "Question marked as spam successfully"}, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response({"detail": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

class UnSpamQuestionView(APIView):
    def post(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
            question.state = 'backlog'
            question.save()
            return Response({"detail": "Un-Spam question successfully"}, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response({"detail": "Question not found"}, status=status.HTTP_404_NOT_FOUND)