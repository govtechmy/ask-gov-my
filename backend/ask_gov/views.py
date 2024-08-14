from .serializers import (
    QuestionSerializer, AgencySerializer,
    TopicSerializer, UserSerializer,
    AccountSerializer, SessionSerializer,
    VerificationTokenSerializer)
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from .models import Question, Agency, Topic, User, Account, Session, VerificationToken
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Sum
from .elasticsearch_client import client
import logging, re

logger = logging.getLogger(__name__)


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

            answer_preview = self.strip_tags(answer)

            question.answer = answer
            question.answer_preview = answer_preview
            question.state = 'completed'
            question.attachments = attachments
            question.answered_date = timezone.now()
            question.save()

            return Response({"detail": "Answer submitted successfully"}, status=status.HTTP_200_OK)
        except Question.DoesNotExist:
            return Response({"detail": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @staticmethod
    def strip_tags(html):
        spaced_html = re.sub(r'>\s*<', '> <', html)
        tag_re = re.compile(r'<[^>]+>')
        text = tag_re.sub('', spaced_html)
        text = re.sub(r'\s+', ' ', text).strip()

        return text


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


class UserView(APIView):
    def post(self, request):
        data = request.data
        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data.get('password', None),
        )
        return Response({
            'id': user.id,
            'email': user.email,
            'emailVerified': user.email_verified
        }, status=status.HTTP_201_CREATED)

    def get(self, request):
        user_id = request.GET.get('id')
        email = request.GET.get('email')
        if user_id:
            user = get_object_or_404(User, id=user_id)
        elif email:
            user = get_object_or_404(User, email=email)
        else:
            return Response({'detail': 'Invalid parameters'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'id': user.id,
            'email': user.email,
            'emailVerified': user.email_verified
        })

    def put(self, request):
        data = request.data
        user = get_object_or_404(User, id=data['id'])
        user.email = data.get('email', user.email)
        user.email_verified = data.get('emailVerified', user.email_verified)
        user.save()
        return Response({
            'id': user.id,
            'email': user.email,
            'emailVerified': user.email_verified
        })


class SessionView(APIView):
    def post(self, request):
        data = request.data
        user = get_object_or_404(User, id=data['userId'])
        session = Session.objects.create(
            user=user,
            session_token=data['sessionToken'],
            expires=data['expires']
        )
        return Response({
            'userId': session.user.id,
            'sessionToken': session.session_token,
            'expires': session.expires
        }, status=status.HTTP_201_CREATED)

    def get(self, request):
        session_token = request.GET.get('sessionToken')
        session = get_object_or_404(Session, session_token=session_token)
        return Response({
            'session': {
                'userId': session.user.id,
                'sessionToken': session.session_token,
                'expires': session.expires
            },
            'user': {
                'id': session.user.id,
                'email': session.user.email,
                'emailVerified': session.user.email_verified
            }
        })

    def put(self, request):
        data = request.data
        session = get_object_or_404(Session, session_token=data['sessionToken'])
        session.expires = data.get('expires', session.expires)
        session.save()
        return Response({
            'userId': session.user.id,
            'sessionToken': session.session_token,
            'expires': session.expires
        })

    def delete(self, request):
        session_token = request.data.get('sessionToken')
        session = get_object_or_404(Session, session_token=session_token)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AccountView(APIView):
    def post(self, request):
        data = request.data
        user = get_object_or_404(User, id=data['userId'])
        account = Account.objects.create(
            user=user,
            provider=data['provider'],
            provider_account_id=data['providerAccountId'],
            access_token=data.get('accessToken', None),
            refresh_token=data.get('refreshToken', None),
            expires_at=data.get('expiresAt', None)
        )
        return Response({
            'userId': account.user.id,
            'provider': account.provider,
            'providerAccountId': account.provider_account_id
        }, status=status.HTTP_201_CREATED)

    def delete(self, request):
        data = request.data
        account = get_object_or_404(Account, user_id=data['userId'], provider=data['provider'],
                                    provider_account_id=data['providerAccountId'])
        account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class VerificationTokenView(APIView):
    def post(self, request):
        data = request.data
        token = VerificationToken.objects.create(
            identifier=data['identifier'],
            token=data['token'],
            expires=data['expires']
        )
        return Response({
            'identifier': token.identifier,
            'token': token.token,
            'expires': token.expires
        }, status=status.HTTP_201_CREATED)

    def put(self, request):
        data = request.data
        token = get_object_or_404(VerificationToken, identifier=data['identifier'], token=data['token'])
        if token.expires < timezone.now():
            return Response({'detail': 'Token expired'}, status=status.HTTP_400_BAD_REQUEST)
        token.delete()
        return Response({
            'identifier': token.identifier,
            'token': token.token
        }, status=status.HTTP_200_OK)


class AddUserView(APIView):
    def post(self, request):
        data = request.data
        user = User.objects.create_user(
            username=data['name'],
            email=data['email'],
            role=data['role'],
            agency=data['agency'],
            user_profile_colour=data['userProfileColour']
        )
        user.save()
        return Response({'message': 'User added successfully'}, status=status.HTTP_201_CREATED)


class EditDeleteUserView(APIView):
    def get(self, request, id):
        user = get_object_or_404(User, id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        data = request.data
        user = get_object_or_404(User, id=id)
        user.name = data['name']
        user.email = data['email']
        user.role = data['role']
        user.agency = data['agency']
        user.user_profile_colour = data['userProfileColour']
        user.save()
        return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)

    def delete(self, request, id):
        user = get_object_or_404(User, id=id)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class GetAllUsersView(APIView):
    def get(self, request):
        users = User.objects.all()
        users_data = [{
            'id': user.id,
            'name': user.username,
            'email': user.email,
            'role': user.role,
            'agency': user.agency,
            'user_profile_colour': user.user_profile_colour,
        } for user in users]
        return Response(users_data, status=status.HTTP_200_OK)


class CheckUserEmailExistsView(APIView):
    def get(self, request):
        email = request.GET.get('email')
        exists = User.objects.filter(email=email).exists()
        return Response(exists, status=status.HTTP_200_OK)
