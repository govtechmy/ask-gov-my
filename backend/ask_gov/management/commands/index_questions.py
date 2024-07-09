from django.core.management.base import BaseCommand
from ask_gov.models import Question
from ask_gov.serializers import QuestionSerializer
from ask_gov.elasticsearch_client import client

class Command(BaseCommand):
    help = 'Indexes all questions into Elasticsearch'

    def handle(self, *args, **kwargs):
        questions = Question.objects.all()
        for question in questions:
            serializer = QuestionSerializer(question)
            document = serializer.data

            agency = question.agency
            if agency:
                agency_data = {
                    "id": agency.id,
                    "name": agency.name,
                    "acronym": agency.acronym,
                    "name_ms": agency.name_ms
                }
            else:
                agency_data = {
                    "id": "",
                    "name": "",
                    "acronym": "",
                    "name_ms": ""
                }

            document['agency'] = agency_data

            client.index(
                index='questions',
                id=str(question.id),
                document=document
            )
            self.stdout.write(self.style.SUCCESS(f'Indexed question {question.id}'))

        self.stdout.write(self.style.SUCCESS('Successfully indexed all questions.'))
