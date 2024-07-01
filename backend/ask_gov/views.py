from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from .models import Question, Agency, Topic
from .serializers import QuestionSerializer, AgencySerializer, TopicSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .elasticsearch_client import client
import logging

logger = logging.getLogger(__name__)
User = get_user_model()



class QuestionListCreateView(generics.ListCreateAPIView):
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

    def post(self, request, agency_id):
        try:
            agency = Agency.objects.get(id=agency_id)
        except Agency.DoesNotExist:
            return Response({"error": "Agency not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.get('data')

        serializer = QuestionSerializer(data=data)
        if serializer.is_valid():
            question = serializer.save()
            question.agency = agency
            question.save()
            
            document = serializer.data
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
        questions = Question.objects.filter(agency=agency)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        logger.debug('LoginView POST request received')
        username = request.data.get("username")
        password = request.data.get("password")
        logger.debug(f'Username: {username}, Password: {password}')
        user = User.objects.filter(username=username).first()
        if user is None or not user.check_password(password):
            logger.debug('Invalid credentials')
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)
        logger.debug('Login successful')
        return Response(tokens, status=status.HTTP_200_OK)
    

class UserAgencyQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        agency = user.agency

        if agency is None:
            return Response({"detail": "User has no agency assigned"}, status=status.HTTP_400_BAD_REQUEST)

        questions = Question.objects.filter(agency=agency)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, question_id):
        user = request.user
        data = request.data.get('data')
        
        if not data:
            return Response({"detail": "Data is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        answer = data.get('answer')
        if not answer:
            return Response({"detail": "Answer is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            question = Question.objects.get(id=question_id)
            question.answer = answer
            question.state = 'completed' 
            question.save()
            
            client.update(
                index='questions',
                id=str(question.id),
                body={
                    "doc": {
                        "answer": answer,
                        "state": "completed"
                    }
                }
            )
            
            return Response({"detail": "Answer submitted successfully"}, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response({"detail": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserAgencyTopicsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        agency = user.agency

        if agency is None:
            return Response({"detail": "User has no agency assigned"}, status=status.HTTP_400_BAD_REQUEST)

        topics = Topic.objects.filter(agency=agency)
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddTopicView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        agency = user.agency

        if agency is None:
            return Response({"detail": "User has no agency assigned"}, status=status.HTTP_400_BAD_REQUEST)

        title = request.data.get('title')
        title_ms = request.data.get('title_ms')
        if not title:
            return Response({"detail": "Title is required"}, status=status.HTTP_400_BAD_REQUEST)

        topic = Topic.objects.create(title=title, title_ms=title_ms, agency=agency)  # Include the new field
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