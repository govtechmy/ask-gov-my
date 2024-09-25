import csv
from django.core.management.base import BaseCommand
from ask_gov.models import Agency, Question
from ask_gov.serializers import QuestionSerializer
from ask_gov.elasticsearch_client import client
from ask_gov.embed import get_embeddings

class Command(BaseCommand):
    help = 'Load questions from a CSV file into the database and index them into Elasticsearch'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['csv_file']

        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                question_text = row['question']
                answer_text = row['answer']
                agency_id = row['agency']

                try:
                    agency = Agency.objects.get(id=agency_id)
                except Agency.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'Agency with ID {agency_id} does not exist.'))
                    continue

                question = Question.objects.create(
                    question=question_text,
                    answer=answer_text,
                    agency=agency,
                    state='completed',  
                    email="example@example.com"
                )

                # serializer = QuestionSerializer(question)
                # document = serializer.data

                # agency_data = {
                #     "id": agency.id,
                #     "name": agency.name,
                #     "acronym": agency.acronym,
                #     "name_ms": agency.name_ms
                # }

                # document['agency'] = agency_data

                # question_embedding = get_embeddings(question_text)
                # answer_embedding = get_embeddings(answer_text) if answer_text else []

                # document['vector'] = question_embedding + answer_embedding

                # client.index(
                #     index='questions',
                #     id=str(question.id),
                #     document=document
                # )

                self.stdout.write(self.style.SUCCESS(f'Successfully added and indexed question "{question_text}"'))

        self.stdout.write(self.style.SUCCESS('Successfully loaded and indexed all questions from the CSV file.'))
