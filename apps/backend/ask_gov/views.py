from .serializers import (
    AdminPatchedQuestionSerializer, AnswerSerializer, QuestionSerializer, AgencySerializer,
    TopicSerializer, UserSerializer,
    AccountSerializer, SessionSerializer,
    VerificationTokenSerializer)
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework import generics, status, pagination, mixins, viewsets
from .models import Answer, Question, Agency, Topic, User, Account, Session, VerificationToken
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Sum, Q
from .elasticsearch_client import client
import logging, re
from datetime import datetime

logger = logging.getLogger(__name__)


class CustomPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 100

class QuestionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Question.objects.trending()
    serializer_class = QuestionSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['agency', 'topics']

class AnswerViewSet(
    viewsets.GenericViewSet,
):
    queryset = Answer.objects.filter(draft=False)
    serializer_class = AnswerSerializer

    @action(methods=["POST"], detail=True)
    def like(self, request, pk):
        answer: Answer = self.get_object()
        answer.likes += 1
        answer.save()
        serializer = AnswerSerializer(answer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=True)
    def dislike(self, request, pk):
        answer: Answer = self.get_object()
        answer.dislikes += 1
        answer.save()
        serializer = AnswerSerializer(answer)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AgencyViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Agency.objects.trending()
    serializer_class = AgencySerializer

class TopicViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["agency"]

class AdminQuestionViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Question.objects.all().order_by('-created_at')
    serializer_class = QuestionSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
            'agency': ['exact', 'isnull'],
        }
    search_fields = ['question']

    def get_queryset(self):
        queryset = self.queryset

        state = self.request.query_params.get('state')
        if state == 'completed':
            queryset = queryset.filter(answer__isnull=False, answer__draft=False)
        elif state == 'draft':
            queryset = queryset.filter(answer__isnull=False, answer__draft=True)
        elif state == 'spam':
            queryset = queryset.filter(spam=True)
        elif state == 'backlog':
            queryset = queryset.filter(answer__isnull=True, spam=False)

        return queryset
    
    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return AdminPatchedQuestionSerializer
        return super().get_serializer_class()
    
    @action(methods=["POST"], detail=True)
    def open(self, request, pk):
        """
        Mark a question as opened.
        """
        question: Question = self.get_object()
        if not question.staff_opened_at or not question.admin_opened_at:
            now = timezone.now()
            # TODO: Update based on request.user.role
            question.admin_opened_at = now
            question.staff_opened_at = now
            question.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminAgencyViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Agency.objects.all()
    serializer_class = AgencySerializer
    pagination_class = CustomPagination
    search_fields = ['name', 'name_ms', 'acronym']


class AdminTopicViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["agency"]


class AdminUserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["role", "agency"]
    search_fields = ["name", "email"]


class AdminAnswerViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class AuthUserView(APIView):
    def post(self, request):
        data = request.data
        user = User.objects.create_user(
            username=data['email'],
            email=data['email'],
            password=data.get('password', None),
        )
        return Response({
            'id': user.id,
            'name': user.username,
            'email': user.email,
            'emailVerified': user.email_verified,
            'role': user.role,
            'agency': user.agency

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
            'name': user.username,
            'email': user.email,
            'emailVerified': user.email_verified,
            'role': user.role,
            'agency': user.agency
        })

    def put(self, request):
        data = request.data
        user = get_object_or_404(User, id=data['id'])
        user.email = data.get('email', user.email)
        user.email_verified = data.get('emailVerified', user.email_verified)
        user.save()
        return Response({
            'id': user.id,
            'name': user.username,
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
                'name': session.user.username,
                'email': session.user.email,
                'emailVerified': session.user.email_verified,
                'role': session.user.role,
                'agency': session.user.agency
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
    def get(self, request):
        provider = request.GET.get('provider')
        provider_account_id = request.GET.get('providerAccountId')

        if not provider or not provider_account_id:
            return Response({
                'detail': 'Invalid parameters'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = Account.objects.select_related('user').get(
                provider=provider,
                provider_account_id=provider_account_id
            )
            user = account.user
            return Response({
                    'id': user.id,
                    'name': user.username,
                    'email': user.email,
                    'emailVerified': user.email_verified,
                    'role': user.role,
                    'agency': user.agency
                }
            )
        except Account.DoesNotExist:
            return Response({"detail": "Account not found."}, status=status.HTTP_404_NOT_FOUND)

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


class CheckUserEmailExistsView(APIView):
    def get(self, request):
        email = request.GET.get('email')
        exists = User.objects.filter(email=email).exists()
        return Response({'isExists':exists}, status=status.HTTP_200_OK)
