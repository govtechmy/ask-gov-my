from django.urls import path, include
from rest_framework.routers import SimpleRouter

from . import views
from .views import (
    AgencyListView, SubmitAnswerView, UserAgencyTopicsView, AddTopicView,
    TopicListView, LikeQuestionView, DislikeQuestionView,
    AssignAgencyToQuestionView, AddAgencyView, TrendingAgenciesView,
    UpdateAgencyView, ChangeAdminIsOpenView, ChangeStaffIsOpenView,
    SaveDraftQuestionView, MarkQuestionAsSpamView, UnSpamQuestionView, UserView,
    SessionView, AccountView, VerificationTokenView, AddUserView,
    GetAllUsersView, CheckUserEmailExistsView, EditDeleteUserView,
    AdminQuestionListView, AdminQuestionDetailView
)

router = SimpleRouter(use_regex_path=False)
router.register("questions", views.QuestionViewSet, basename="question")

urlpatterns = [
    path("", include(router.urls)),
    path('agencies/', AgencyListView.as_view(), name='agency-list'),
    path('agencies/<int:pk>/', UpdateAgencyView.as_view(), name='update-agency'),
    path('questions/<int:question_id>/submit-answer/', SubmitAnswerView.as_view(), name='submit-answer'),
    path('topics/user-agency/<int:agency_id>/', UserAgencyTopicsView.as_view(), name='user-agency-topics'),
    path('topics/add/<int:agency_id>/', AddTopicView.as_view(), name='add-topic'),
    path('topics/', TopicListView.as_view(), name='topics-list'),
    path('questions/<int:question_id>/like/', LikeQuestionView.as_view(), name='like-question'),
    path('questions/<int:question_id>/dislike/', DislikeQuestionView.as_view(), name='dislike-question'),
    path('questions/<int:question_id>/agency/', AssignAgencyToQuestionView.as_view(), name='assign-agency-to-question'), 
    path('agencies/add/', AddAgencyView.as_view(), name='add-agency'),
    path('agencies/trending/', TrendingAgenciesView.as_view(), name='trending-agencies'),
    path('questions/<int:question_id>/admin_isopen/', ChangeAdminIsOpenView.as_view(), name='change-admin-isopen'),
    path('questions/<int:question_id>/staff_isopen/', ChangeStaffIsOpenView.as_view(), name='change-staff-isopen'),
    path('questions/<int:question_id>/save-draft/', SaveDraftQuestionView.as_view(), name='save-draft'),
    path('questions/<int:question_id>/mark-spam/', MarkQuestionAsSpamView.as_view(), name='mark-question-spam'),
    path('questions/<int:question_id>/un-spam/', UnSpamQuestionView.as_view(), name='mark-question-spam'),
    path('auth/user/', UserView.as_view(), name='user'),
    path('auth/session/', SessionView.as_view(), name='session'),
    path('auth/account/', AccountView.as_view(), name='account'),
    path('auth/verification/', VerificationTokenView.as_view(), name='verification'),

    # admin paths
    path('admin/user/', AddUserView.as_view(), name='add_user'),
    path('admin/user/<uuid:id>/', EditDeleteUserView.as_view(), name='edit_delete_user'),
    path('admin/users/', GetAllUsersView.as_view(), name='get_all_users'),
    path('admin/check-email/', CheckUserEmailExistsView.as_view(), name='check_email_exists'),
    path('admin/questions/', AdminQuestionListView.as_view(), name='admin-question-list'),
    path('admin/questions/<int:pk>/', AdminQuestionDetailView.as_view(), name='admin-question-detail')
]
