
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from ..models import Answer, User, Question, Agency

class TestSubmitAnswer(APITestCase):
    def setUp(self):
        agency = Agency.objects.create(name="Ministry of Education", name_ms="Kementerian Pendidikan", acronym="MOE")
        self.question = Question.objects.create(question="Question 1", agency=agency)

    def test_submit_answer(self):
        url = reverse('submit-answer', kwargs={'question_id': self.question.id})
        data = {
            "data": {
                "answer": "<p>Answer 1</p>"
            }
        }
        response = self.client.post(url, data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class TestAdminListQuestions(APITestCase):
    """
    Ensure that the correct number of questions is returned for each state, and that the API returns a successful response.
    """

    NUM_BACKLOG = 1
    NUM_SPAM = 3
    NUM_COMPLETED = 5
    NUM_DRAFT = 2
    NUM_ALL = NUM_BACKLOG + NUM_SPAM + NUM_COMPLETED + NUM_DRAFT

    def setUp(self):
        agency = Agency.objects.create(name="Ministry of Education", name_ms="Kementerian Pendidikan", acronym="MOE")
        for i in range(0, self.NUM_BACKLOG):
            Question.objects.create(question=f"Question backlog {i + 1}", agency=agency)
        for i in range (0, self.NUM_SPAM):
            Question.objects.create(question=f"Question spam {i + 1}", agency=agency, spam=True)
        for i in range (0, self.NUM_COMPLETED):
            question = Question.objects.create(question=f"Question completed {i + 1}", agency=agency, spam=False)
            Answer.objects.create(question=question, text=f"Answer completed {i + 1}", draft=False)
        for i in range (0, self.NUM_DRAFT):
            question = Question.objects.create(question=f"Question draft {i + 1}", agency=agency, spam=False)
            Answer.objects.create(question=question, text=f"Answer draft {i + 1}", draft=True)
        
    def test_list_all(self):
        url = reverse('admin-question-list')
        response = self.client.get(url)
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_ALL)

    def test_list_backlog(self):
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'backlog'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_BACKLOG)

    def test_list_spam(self):
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'spam'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_SPAM)

    def test_list_completed(self):
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'completed'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_COMPLETED)

    def test_list_draft(self):
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'draft'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_DRAFT)

class TestQuestionViewSet(APITestCase):
    def setUp(self):
        for i in range(0, 10):
            Question.objects.create(
                question=f"Question {i + 1}",
                email="test@example.com",
            )
        self.submit_question_url = reverse("question-list")
    
    def test_submit_long_question(self):
        """
        Tests submitting a question that exceeds the 255 character limit.
        """
        data = {
            "question": "X" * 256,
            "email": "test@example.com"
        }
        response = self.client.post(
            self.submit_question_url,
            data=data,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
