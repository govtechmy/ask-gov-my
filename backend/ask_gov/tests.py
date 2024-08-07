from django.test import TestCase
from django.urls import reverse

from faker import Faker
from ask_gov.models import User, Question

fake = Faker()


def create_accounts():
    pass


class TestAskGov(TestCase):
    def setUp(self):
        user_email = fake.email()
        superuser_email = fake.email()
        User.objects.create_user(username= user_email.split('@')[0], email=user_email, password='test786')
        User.objects.create_superuser(username= superuser_email.split('@')[0], email=superuser_email, password='test5579')

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
