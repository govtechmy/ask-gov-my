from django.test import TestCase
from django.urls import reverse

from faker import Faker
from ask_gov.models import CustomUser, Question

fake = Faker()
def create_accounts():
    pass


class TestAskGov(TestCase):
    def setUp(self):
        CustomUser.objects.create_user(username='test_user', password='test786')
        CustomUser.objects.create_superuser(username='testsuperuser', password='test5579')

    def test_setup_working(self):
        self.assertEqual(CustomUser.objects.count(), 2)

    def test_get_all_questions(self):
        url = reverse('question-list-create')
        response = self.client.post(url, data={'question': f'{fake.bs()}?', 'email': fake.email()})
        # print(response.json())
        self.assertEqual(response.status_code, 201)

        response = self.client.get(url)
        # print(response.json())
        self.assertEqual(response.status_code, 200)

    def test_get_question_detail(self):
        Question.objects.create(question=f'{fake.bs()}?', email=fake.email())
        url = reverse('question-detail', kwargs={'pk': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
