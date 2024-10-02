from .serializers import (
    AdminPatchedQuestionSerializer, AnswerSerializer, QuestionSerializer,
    AgencySerializer, TopicSerializer, UserSerializer,
)
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework import generics, status, pagination, mixins, viewsets
from .models import Answer, Question, Agency, Topic, User
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
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

    @extend_schema(request=None)
    @action(methods=["POST"], detail=True)
    def like(self, request, pk):
        answer: Answer = self.get_object()
        answer.likes += 1
        answer.save()
        serializer = AnswerSerializer(answer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(request=None)
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


class CheckUserEmailExistsView(APIView):
    def get(self, request):
        email = request.GET.get('email')
        exists = User.objects.filter(email=email).exists()
        return Response({'isExists':exists}, status=status.HTTP_200_OK)
