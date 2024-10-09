import math
from django.conf import settings
from ask_gov.permissions import IsSuperAdmin
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
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics, status, pagination, mixins, viewsets, exceptions, serializers
from .models import Answer, Question, Agency, Topic, User, UserRole
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes, inline_serializer
from django.contrib.auth import get_user_model
from django.db.models import Sum, Q
from .elastic import client
from .embed import get_embedding
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
    permission_classes = [AllowAny]

    QUESTION_INDEX = settings.ELASTICSEARCH_QUESTION_INDEX
    EMBEDDING_ENABLED = settings.FEATURE_FLAGS.get("EMBEDDING")

    @extend_schema(
            parameters=[
                OpenApiParameter("q", OpenApiTypes.STR, OpenApiParameter.QUERY, description="Search term"),
                OpenApiParameter("page", OpenApiTypes.INT, OpenApiParameter.QUERY, default=1),
                OpenApiParameter("page_size", OpenApiTypes.INT, OpenApiParameter.QUERY, default=6),
            ],
            responses=inline_serializer(
                name="SearchQuestionResults",
                fields={
                    "count": serializers.IntegerField(),
                    "next": serializers.IntegerField(allow_null=True),
                    "prev": serializers.IntegerField(allow_null=True),
                    "results": QuestionSerializer(many=True),
                }
            )
    )
    @action(methods=["GET"], detail=False)
    def search(self, request):
        """
        Search questions.
        """
        query = request.query_params.get("q", "")
        page = request.query_params.get("page", 1)
        page_size = request.query_params.get("page_size", 6)
        if not query:
            raise exceptions.ValidationError("Search query is required.")

        es_query = {
            "bool": {
                "must": [
                    { "match": { "spam": False } },
                    { "match": { "answer.draft": False } }
                ],
                "should": [
                    {
                        "multi_match": {
                            "query": query,
                            "fields": ["agency.name", "agency.acronym", "agency.name_ms"],
                            "boost": 0.5,
                        },
                    },
                    {
                        "knn": {
                            "field": "vector",
                            "query_vector": get_embedding(query),
                            "num_candidates": 50,
                            "boost": 1,
                        }
                    } if self.EMBEDDING_ENABLED else {}
                ]
            }
        }

        es_response = client.search(
            index=self.QUESTION_INDEX,
            query=es_query,
            from_=(page - 1) * page_size,
            size=page_size,
            _source={
                "excludes": ["vector"],
            }
        )

        count = es_response["hits"]["total"]["value"]
        questions = [hit["_source"] for hit in es_response["hits"]["hits"]]
        last_page = math.ceil(count / page_size)

        paginated_response = {
            "count": count,
            "next": page + 1 if page < last_page else None,
            "prev": page - 1 if page > 1 else None,
            "results": questions
        }

        return Response(paginated_response, status=status.HTTP_200_OK)

class AnswerViewSet(
    viewsets.GenericViewSet,
):
    queryset = Answer.objects.filter(draft=False)
    serializer_class = AnswerSerializer
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

class TopicViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["agency"]
    permission_classes = [AllowAny]

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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset

        # Filter query by user agency if they are not a super admin
        if self.request.user.role != UserRole.SUPER_ADMIN:
            queryset = queryset.filter(agency=self.request.user.agency)

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
    queryset = Agency.objects.all().order_by("id")
    serializer_class = AgencySerializer
    pagination_class = CustomPagination
    search_fields = ['name', 'name_ms', 'acronym']
    permission_classes = [IsAuthenticated, IsSuperAdmin]


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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset

        # Filter query by user agency if they are not a super admin
        if self.request.user.role != UserRole.SUPER_ADMIN:
            queryset = queryset.filter(agency=self.request.user.agency)

        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != UserRole.SUPER_ADMIN:
            if self.request.user.agency.id != serializer.validated_data["agency"].id:
                raise exceptions.PermissionDenied("Cannot create a topic that does not belong to your agency.")
        return super().perform_create(serializer)
    
    def perform_update(self, serializer):
        if self.request.user.role != UserRole.SUPER_ADMIN:
            if self.request.user.agency.id != serializer.validated_data["agency"].id:
                raise exceptions.PermissionDenied("Cannot update a topic that does not belong to your agency.")
        return super().perform_update(serializer)


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
    permission_classes = [IsAuthenticated, IsSuperAdmin]


class AdminAnswerViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != UserRole.SUPER_ADMIN:
            if self.request.user.agency.id != serializer.validated_data["question"].agency.id:
                raise exceptions.PermissionDenied("Cannot create an answer that does not belong to your agency.")
        return super().perform_create(serializer)

    def perform_update(self, serializer):
        if self.request.user.role != UserRole.SUPER_ADMIN:
            if self.request.user.agency.id != serializer.validated_data["question"].agency.id:
                raise exceptions.PermissionDenied("Cannot update an answer that does not belong to your agency.")
        return super().perform_update(serializer)


class CheckUserEmailExistsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        email = request.GET.get('email')
        exists = User.objects.filter(email=email).exists()
        return Response({'isExists':exists}, status=status.HTTP_200_OK)
