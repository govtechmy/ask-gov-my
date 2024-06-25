from django.urls import path
from .views import QuestionListCreateView, QuestionDetailView, AgencyListView, submit_question, get_questions_by_agency

urlpatterns = [
    path('questions/', QuestionListCreateView.as_view(), name='question-list-create'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
    path('agencies/', AgencyListView.as_view(), name='agency-list'),
    path('submit-question/<int:agency_id>/', submit_question, name='submit-question'),
    path('questions-by-agency/<int:agency_id>/', get_questions_by_agency, name='questions-by-agency'),
]
