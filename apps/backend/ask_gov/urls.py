from django.urls import path, include
from rest_framework.routers import SimpleRouter

from . import views
from .views import (
    AuthUserView, SubmitAnswerView, ChangeAdminIsOpenView,
    ChangeStaffIsOpenView, SaveDraftQuestionView, SessionView, AccountView,
    VerificationTokenView,  CheckUserEmailExistsView, 
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

urlpatterns = [
    path("", include(router.urls)),

    # admin paths
    path('questions/<int:question_id>/submit-answer/', SubmitAnswerView.as_view(), name='submit-answer'),
    path('questions/<int:question_id>/admin_isopen/', ChangeAdminIsOpenView.as_view(), name='change-admin-isopen'),
    path('questions/<int:question_id>/staff_isopen/', ChangeStaffIsOpenView.as_view(), name='change-staff-isopen'),
    path('questions/<int:question_id>/save-draft/', SaveDraftQuestionView.as_view(), name='save-draft'),

    # auth paths
    path('auth/user/', AuthUserView.as_view(), name='user'),
    path('auth/session/', SessionView.as_view(), name='session'),
    path('auth/account/', AccountView.as_view(), name='account'),
    path('auth/verification/', VerificationTokenView.as_view(), name='verification'),
    path('admin/check-email/', CheckUserEmailExistsView.as_view(), name='check_email_exists'),
]
