from django.urls import reverse
from faker import Faker
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Answer, User, Question, Agency

fake = Faker()


def create_accounts():
    pass


class TestAskGov(APITestCase):
    def setUp(self):
        self.agency = Agency.objects.create()
        self.user_email = fake.email()
        self.superuser_email = fake.email()
        User.objects.create_user(username=self.user_email.split('@')[0], email=self.user_email, password='test786')
        User.objects.create_superuser(username=self.superuser_email.split('@')[0], email=self.superuser_email,
                                      password='test5579')

    def test_setup_working(self):
        self.assertEqual(User.objects.count(), 2)

    def test_get_all_questions(self):
        url = reverse('question-list-create')
        response = self.client.post(url, data={'question': f'{fake.bs()}?', 'email': fake.email()})
        # print(response.json())
        self.assertEqual(response.status_code, 201)

        response = self.client.get(url)
        # print(response.json())
        self.assertEqual(response.status_code, 200)

    def test_get_question_detail(self):
        question = Question.objects.create(question=f'{fake.bs()}?', email=fake.email())
        url = reverse('question-detail', kwargs={'pk': question.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_questions(self):
        url = reverse('question-list-create')
        response = self.client.get(url)
        # print(response)
        # print(response.json())

        url = reverse('all-user-questions')
        response = self.client.get(url)
        # print(response)
        # print(response.json())

    def test_all_users_method(self):
        url = reverse('get_all_users')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        self.assertEqual(User.objects.count(), 2)
        url = reverse('add_user')
        unique_email = fake.email()
        unique_name = fake.name()
        data = {
            'name': unique_name, 'email': unique_email,
            'role': 'staff',
            'agency': self.agency.pk,
            'userProfileColour': 'red'}
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 3)

        url = reverse('get_all_users')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        user_list = response.json()
        self.assertEqual(len(user_list['results']), 3)

        user = User.objects.get(email=unique_email)
        user.name = unique_name
        user.save()

        url = reverse('edit_delete_user', kwargs={'id': str(user.pk)})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        url = reverse('edit_delete_user', kwargs={'id': str(user.pk)})
        response = self.client.put(url, data={'name': unique_name, 'email': unique_email,
                                              'role': 'staff',
                                              'agency': self.agency.pk, 'userProfileColour': 'black'})
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(User.objects.get(email=unique_email).user_profile_colour, 'red')
        self.assertEqual(User.objects.get(email=unique_email).user_profile_colour, 'black')

        self.assertEqual(User.objects.count(), 3)
        url = reverse('edit_delete_user', kwargs={'id': str(user.pk)})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(User.objects.count(), 2)

    def test_api_auth_user(self):
        user_email = self.user_email
        url = reverse('user')
        response = self.client.get(url, data={'email': user_email})
        self.assertEqual(response.status_code, 200)

        user = User.objects.get(email=self.user_email)
        user_id = str(user.pk)
        response = self.client.get(url, data={'id': user_id})
        self.assertEqual(response.status_code, 200)

        url = reverse('user')

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