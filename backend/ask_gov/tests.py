from django.urls import reverse
from faker import Faker
from rest_framework.test import APITestCase

from .models import User, Question, Agency

fake = Faker()


def create_accounts():
    pass


class TestAskGov(APITestCase):
    def setUp(self):
        self.agency = Agency.objects.create()
        user_email = fake.email()
        superuser_email = fake.email()
        User.objects.create_user(username=user_email.split('@')[0], email=user_email, password='test786')
        User.objects.create_superuser(username=superuser_email.split('@')[0], email=superuser_email,
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
        self.assertEqual(len(user_list), 3)

        user = User.objects.get(email=unique_email)
        user.name = unique_name
        user.save()

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
