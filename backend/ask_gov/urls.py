from django.urls import path
from .views import (QuestionListCreateView, QuestionDetailView, AgencyListView, SubmitQuestionView, 
                    QuestionsByAgencyView, LoginView, UserAgencyQuestionsView, SubmitAnswerView, 
                    UserAgencyTopicsView, AddTopicView, TopicListView, LikeQuestionView, DislikeQuestionView,
                    AssignAgencyToQuestionView)
urlpatterns = [
    path('questions/', QuestionListCreateView.as_view(), name='question-list-create'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
    path('agencies/', AgencyListView.as_view(), name='agency-list'),
    path('submit-question/', SubmitQuestionView.as_view(), name='submit-question'),
    path('questions/by-agency/<int:agency_id>/', QuestionsByAgencyView.as_view(), name='questions-by-agency'),
    path('login/', LoginView.as_view(), name='login'),
    path('questions/user-agency/', UserAgencyQuestionsView.as_view(), name='user-agency-questions'),
    path('questions/<int:question_id>/submit-answer/', SubmitAnswerView.as_view(), name='submit-answer'),
    path('topics/user-agency/', UserAgencyTopicsView.as_view(), name='user-agency-topics'),
    path('topics/add/', AddTopicView.as_view(), name='add-topic'),
    path('topics/', TopicListView.as_view(), name='topics-list'),
    path('questions/<int:question_id>/like/', LikeQuestionView.as_view(), name='like-question'),
    path('questions/<int:question_id>/dislike/', DislikeQuestionView.as_view(), name='dislike-question'),
    path('questions/<int:question_id>/agency/', AssignAgencyToQuestionView.as_view(), name='assign-agency-to-question'),  # New endpoint

]
