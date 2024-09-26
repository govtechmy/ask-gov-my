from django.urls import path, include
from rest_framework.routers import SimpleRouter

from . import views
from .views import (
    AgencyListView, SubmitAnswerView, UserAgencyTopicsView, AddTopicView,
    AddAgencyView, UpdateAgencyView, ChangeAdminIsOpenView,
    ChangeStaffIsOpenView, SaveDraftQuestionView, UserView, SessionView,
    AccountView, VerificationTokenView, AddUserView, GetAllUsersView,
    CheckUserEmailExistsView, EditDeleteUserView
)

router = SimpleRouter(use_regex_path=False)
router.register("questions", views.QuestionViewSet, basename="question")
router.register("answers", views.AnswerViewSet, basename="answer")
router.register("agencies", views.AgencyViewSet, basename="agency")
router.register("topics", views.TopicViewSet, basename="topic")
router.register("admin/questions", views.AdminQuestionViewSet, basename="admin-question")

urlpatterns = [
    path("", include(router.urls)),

    # admin paths
    path('questions/<int:question_id>/submit-answer/', SubmitAnswerView.as_view(), name='submit-answer'),
    path('questions/<int:question_id>/admin_isopen/', ChangeAdminIsOpenView.as_view(), name='change-admin-isopen'),
    path('questions/<int:question_id>/staff_isopen/', ChangeStaffIsOpenView.as_view(), name='change-staff-isopen'),
    path('questions/<int:question_id>/save-draft/', SaveDraftQuestionView.as_view(), name='save-draft'),

    path('agencies/', AgencyListView.as_view(), name='agency-list'), 
    path('agencies/<int:pk>/', UpdateAgencyView.as_view(), name='update-agency'),
    path('agencies/add/', AddAgencyView.as_view(), name='add-agency'),

    path('topics/user-agency/<int:agency_id>/', UserAgencyTopicsView.as_view(), name='user-agency-topics'),
    path('topics/add/<int:agency_id>/', AddTopicView.as_view(), name='add-topic'),

    path('admin/user/', AddUserView.as_view(), name='add_user'),
    path('admin/users/', GetAllUsersView.as_view(), name='get_all_users'),
    path('admin/user/<uuid:id>/', EditDeleteUserView.as_view(), name='edit_delete_user'),

    # auth paths
    path('auth/user/', UserView.as_view(), name='user'),
    path('auth/session/', SessionView.as_view(), name='session'),
    path('auth/account/', AccountView.as_view(), name='account'),
    path('auth/verification/', VerificationTokenView.as_view(), name='verification'),
    path('admin/check-email/', CheckUserEmailExistsView.as_view(), name='check_email_exists'),
]
