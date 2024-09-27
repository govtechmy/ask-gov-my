from django.urls import path, include
from rest_framework.routers import SimpleRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from . import views
from .views import (
    AuthUserView, SessionView, AccountView, VerificationTokenView,
    CheckUserEmailExistsView, 
)


router = SimpleRouter(use_regex_path=False)
router.register("questions", views.QuestionViewSet, basename="question")
router.register("answers", views.AnswerViewSet, basename="answer")
router.register("agencies", views.AgencyViewSet, basename="agency")
router.register("topics", views.TopicViewSet, basename="topic")
router.register("admin/questions", views.AdminQuestionViewSet, basename="admin-question")
router.register("admin/agencies", views.AdminAgencyViewSet, basename="admin-agency")
router.register("admin/topics", views.AdminTopicViewSet, basename="admin-topic")
router.register("admin/users", views.AdminUserViewSet, basename="admin-user")
router.register("admin/answers", views.AdminAnswerViewSet, basename="admin-answer")

urlpatterns = [
    path("", include(router.urls)),

    # auth
    path('auth/user/', AuthUserView.as_view(), name='user'),
    path('auth/session/', SessionView.as_view(), name='session'),
    path('auth/account/', AccountView.as_view(), name='account'),
    path('auth/verification/', VerificationTokenView.as_view(), name='verification'),
    path('admin/check-email/', CheckUserEmailExistsView.as_view(), name='check_email_exists'),

    # docs
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
