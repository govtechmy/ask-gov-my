from django.urls import path
from .views import QuestionListCreateView, QuestionDetailView, AgencyListView, submit_question

urlpatterns = [
    path('questions/', QuestionListCreateView.as_view(), name='question-list-create'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
    path('agencies/', AgencyListView.as_view(), name='agency-list'),
    path('submit-question/<int:agency_id>/', submit_question, name='submit-question'),
]
