
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token

from ..models import Answer, User, Question, Agency, UserRole


class TestAdminListQuestions(APITestCase):
    """
    Ensure that the correct number of questions is returned for each state, and that the API returns a successful response.
    """

    NUM_UNANSWERED = 1
    NUM_SPAM = 3
    NUM_ANSWERED = 5
    NUM_DRAFT = 2
    NUM_UNASSIGNED = 4
    NUM_ALL = NUM_UNANSWERED + NUM_SPAM + NUM_ANSWERED + NUM_DRAFT + NUM_UNASSIGNED

    def setUp(self):
        agency = Agency.objects.create(name="Ministry of Education", name_ms="Kementerian Pendidikan", acronym="MOE")
        user = User.objects.create(name="John Doe", email="johndoe@example.com", role=UserRole.SUPER_ADMIN)
        token = Token.objects.create(user=user)
        self.client.force_authenticate(user, token)
        self.agency = agency

        for i in range(0, self.NUM_UNANSWERED):
            Question.objects.create(question=f"Question backlog {i + 1}", agency=agency)
        for i in range (0, self.NUM_SPAM):
            Question.objects.create(question=f"Question spam {i + 1}", agency=agency, spam=True)
        for i in range (0, self.NUM_ANSWERED):
            question = Question.objects.create(question=f"Question completed {i + 1}", agency=agency, spam=False)
            Answer.objects.create(question=question, text=f"Answer completed {i + 1}", draft=False)
        for i in range (0, self.NUM_DRAFT):
            question = Question.objects.create(question=f"Question draft {i + 1}", agency=agency, spam=False)
            Answer.objects.create(question=question, text=f"Answer draft {i + 1}", draft=True)
        for i in range (0, self.NUM_UNASSIGNED):
            question = Question.objects.create(question=f"Question unassigned {i + 1}", spam=False)
        
    def test_list_all(self):
        url = reverse('admin-question-list')
        response = self.client.get(url)
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_ALL)

    def test_list_unanswered(self):
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'unanswered'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Super admins can see unassigned questions, and they are also considered unaswered!
        self.assertEqual(json_data['count'], self.NUM_UNANSWERED + self.NUM_UNASSIGNED)

    def test_list_spam(self):
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'spam'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_SPAM)

    def test_list_answered(self):
        user = User.objects.create(name="Staff", email="staff@example.com", agency=self.agency, role=UserRole.STAFF)
        token = Token.objects.create(user=user)
        self.client.force_authenticate(user, token)
        url = reverse('admin-question-list')

        response = self.client.get(url, {'state': 'answered'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_ANSWERED)

    def test_list_draft(self):
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'draft'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_DRAFT)

    def test_list_unassigned(self):
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'unassigned'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_UNASSIGNED)

    def test_list_assigned(self):
        """
        Tests listing assigned questions should return all questions except for
        those without agency or marked as spam.
        """
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'assigned'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_ALL - self.NUM_UNASSIGNED - self.NUM_SPAM)
    
class TestAdminListQuestionsAsStaff(APITestCase):
    NUM_UNANSWERED = 1
    NUM_SPAM = 3
    NUM_ANSWERED = 5
    NUM_DRAFT = 2
    NUM_UNASSIGNED = 4
    NUM_ALL = NUM_UNANSWERED + NUM_SPAM + NUM_ANSWERED + NUM_DRAFT + NUM_UNASSIGNED
    NUM_VISIBLE = NUM_ALL - NUM_SPAM - NUM_UNASSIGNED

    def setUp(self):
        agency = Agency.objects.create(name="Ministry of Education", name_ms="Kementerian Pendidikan", acronym="MOE")
        user = User.objects.create(name="Staff", email="staff@example.com", agency=agency, role=UserRole.STAFF)
        token = Token.objects.create(user=user)
        self.client.force_authenticate(user, token)
        self.agency = agency

        for i in range(0, self.NUM_UNANSWERED):
            Question.objects.create(question=f"Question backlog {i + 1}", agency=agency)
        for i in range (0, self.NUM_SPAM):
            Question.objects.create(question=f"Question spam {i + 1}", agency=agency, spam=True)
        for i in range (0, self.NUM_ANSWERED):
            question = Question.objects.create(question=f"Question completed {i + 1}", agency=agency, spam=False)
            Answer.objects.create(question=question, text=f"Answer completed {i + 1}", draft=False)
        for i in range (0, self.NUM_DRAFT):
            question = Question.objects.create(question=f"Question draft {i + 1}", agency=agency, spam=False)
            Answer.objects.create(question=question, text=f"Answer draft {i + 1}", draft=True)
        for i in range (0, self.NUM_UNASSIGNED):
            question = Question.objects.create(question=f"Question unassigned {i + 1}", spam=False)
        
    def test_list_all(self):
        """
        Tests staff should only see questions that are:
        1. Assigned to their own agency and
        2. Not marked as spam
        """
        url = reverse('admin-question-list')
        response = self.client.get(url)
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_VISIBLE)

    def test_list_unanswered(self):
        """
        Tests listing unanswered questions.
        """
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'unanswered'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_UNANSWERED)

    def test_list_spam(self):
        """
        Tests staff shouldn't be able to list spammed questions.
        """
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'spam'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_VISIBLE)

    def test_list_answered(self):
        """
        Tests listing answered questions.
        """
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'answered'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_ANSWERED)

    def test_list_draft(self):
        """
        Tests listing drafted questions.
        """
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'draft'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], self.NUM_DRAFT)

    def test_list_unassigned(self):
        """
        Tests listing unassigned questions should return empty list to staff.
        """
        url = reverse('admin-question-list')
        response = self.client.get(url, {'state': 'unassigned'})
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data['count'], 0)

class TestQuestionViewSet(APITestCase):
    def setUp(self):
        self.agency = Agency.objects.create(name="Ministry of Education", name_ms="Kementerian Pendidikan", acronym="MOE")
        for i in range(0, 10):
            Question.objects.create(
                question=f"Question {i + 1}",
                email="test@example.com",
                agency=self.agency,
            )
        self.submit_question_url = reverse("question-list")
        self.search_questions_url = reverse("question-search")
    
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
    
    def test_search_questions(self):
        """
        Tests searching questions.
        """
        response = self.client.get(
            self.search_questions_url,
            {"page": "2", "page_size": "2", "q": self.agency.acronym},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class TestAdminQuestionViewSet(APITestCase):
    NUM_QUESTIONS = 10

    def setUp(self):
        self.agency = Agency.objects.create(name="Ministry of Education", name_ms="Kementerian Pendidikan", acronym="MOE")
        for i in range(0, self.NUM_QUESTIONS):
            Question.objects.create(
                question=f"Question {i + 1}",
                email="test@example.com",
                agency=self.agency,
            )
        self.question = Question.objects.first()
        self.update_question_url = reverse("admin-question-detail", kwargs={"pk": self.question.id})
        self.open_question_url = reverse("admin-question-open", kwargs={"pk": self.question.id})
        self.list_questions_url = reverse("admin-question-list")

        self.user = User.objects.create(name="John Doe", email="johndoe@example.com", agency=self.agency, role=UserRole.STAFF)
        token = Token.objects.create(user=self.user)
        self.client.force_authenticate(self.user, token)

    def test_assign_agency(self):
        """
        Tests assigning an agency to a question.
        """
        data = {
            "agency": self.agency.id,
        }
        response = self.client.patch(
            self.update_question_url,
            data=data,
        )
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data["agency"], self.agency.id)

    def test_mark_as_spam(self):
        """
        Tests marking a question as spam.
        """
        data = {
            "spam": True
        }
        response = self.client.patch(
            self.update_question_url,
            data=data,
        )
        json_data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json_data["spam"], True)
    
    def test_open_question(self):
        """
        Tests marking a question as opened.
        """
        self.assertFalse(self.question.admin_opened_at)
        self.assertFalse(self.question.staff_opened_at)
        response = self.client.post(
            self.open_question_url,
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.question.refresh_from_db()
        self.assertTrue(self.question.admin_opened_at)
        self.assertTrue(self.question.staff_opened_at)

    def test_list_question_filters_user_agency(self):
        """
        Tests listing questions as a `staff` should only return questions belonging to the user's agency.
        """
        other_agency = Agency.objects.create(name="Other Ministry", name_ms="Other Ministry", acronym="OM")
        Question.objects.create(
            question="Question from other ministry",
            email="test@example.com",
            agency=other_agency,
        )
        response = self.client.get(
            self.list_questions_url,
            {"page_size": Question.objects.count()}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        json_data = response.json()
        questions = json_data["results"]
        for question in questions:
            self.assertEqual(question["agency"]["id"], self.user.agency.id)

class TestAdminAnswerViewSet(APITestCase):
    def setUp(self):
        agency = Agency.objects.create(name="Ministry of Education", name_ms="Kementerian Pendidikan", acronym="MOE")
        self.question = Question.objects.create(
            agency=agency,
            question="Test Question",
        )
        self.submit_answer_url = reverse("admin-answer-list")

        user = User.objects.create(name="John Doe", email="johndoe@example.com", agency=agency, role=UserRole.STAFF)
        token = Token.objects.create(user=user)
        self.client.force_authenticate(user, token)
        self.user=user
    
    def test_submit_answer(self):
        """
        Tests submitting an answer.
        """
        self.assertFalse(self.question.has_answer())
        data = {
            "question": self.question.id,
            "raw": "<p>Test Answer</p>",
            "text": "Test Answer",
            "draft": False,
        }
        response = self.client.post(self.submit_answer_url, data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.question.refresh_from_db()
        self.assertTrue(self.question.has_answer())
    
    def test_submit_answer_no_agency(self):
        """
        Tests submitting an answer that isn't assigned an agency yet.
        """
        self.question.agency = None
        self.question.save()
        data = {
            "question": self.question.id,
            "raw": "<p>Test Answer</p>",
            "text": "Test Answer",
            "draft": False,
        }
        response = self.client.post(self.submit_answer_url, data=data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_submit_answer_other_agency(self):
        """
        Tests user with role `staff` submitting an answer for a different agency.
        """
        other_agency = Agency.objects.create(name="Other Ministry", name_ms="Other Ministry", acronym="OM")
        self.question.agency = other_agency
        self.question.save()
        data = {
            "question": self.question.id,
            "raw": "<p>Test Answer</p>",
            "text": "Test Answer",
            "draft": False,
        }
        response = self.client.post(self.submit_answer_url, data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class TestAdminTopicViewSet(APITestCase):
    def setUp(self):
        agency = Agency.objects.create(name="Ministry of Education", name_ms="Kementerian Pendidikan", acronym="MOE")
        user = User.objects.create(name="John Doe", email="johndoe@example.com", agency=agency, role=UserRole.STAFF)
        token = Token.objects.create(user=user)
        self.client.force_authenticate(user, token)

        self.create_topic_url = reverse("admin-topic-list")

    def test_create_for_other_agency(self):
        """
        Tests user with role `staff` creating a topic for a different agency.
        """
        other_agency = Agency.objects.create(name="Other Ministry", name_ms="Other Ministry", acronym="OM")
        response = self.client.post(
            self.create_topic_url,
            data={
                "title_ms": "Test Topic",
                "title_en": "Test Topic",
                "agency": other_agency.id,
            }
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class TestAdminAttachmentViewSet(APITestCase):
    def setUp(self):
        self.agency = Agency.objects.create(name="Ministry of Education", name_ms="Kementerian Pendidikan", acronym="MOE")
        self.question = Question.objects.create(
            question=f"Test Question",
            email="test@example.com",
            agency=self.agency,
        )
        self.create_attachments_url = reverse("admin-attachment-list")

        self.user = User.objects.create(name="John Doe", email="johndoe@example.com", agency=self.agency, role=UserRole.STAFF)
        token = Token.objects.create(user=self.user)
        self.client.force_authenticate(self.user, token)

    def test_attachment_for_other_agency(self):
        """
        Tests user with role `staff` creating an attachment for a different agency.
        """
        other_agency = Agency.objects.create(name="Other Ministry", name_ms="Other Ministry", acronym="OM")
        self.question.agency = other_agency
        self.question.save()
        data = {
            "question": self.question.id,
            "file_key": "foo",
            "file_size": 16_000,
        }
        response = self.client.post(self.create_attachments_url, data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)