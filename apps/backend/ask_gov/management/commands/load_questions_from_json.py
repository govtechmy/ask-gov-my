import json
from django.core.management.base import BaseCommand
from ask_gov.models import Agency, Answer, Question

class Command(BaseCommand):
    help = 'Load questions from a JSON file into the database and index them into Elasticsearch'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='The path to the JSON file')

    def handle(self, *args, **kwargs):
        json_file_path = kwargs['json_file']

        with open(json_file_path, 'r') as file:
            json_array = json.load(file)

        for item in json_array:
            question_text = item['question']
            answer_text = item['answer_text']
            answer_raw = item['answer_raw']
            agency_id = item['agency_id']

            try:
                agency = Agency.objects.get(id=agency_id)
            except Agency.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Agency with ID {agency_id} does not exist.'))
                continue

            question = Question.objects.create(
                question=question_text,
                agency=agency,
                email="example@example.com"
            )
            Answer.objects.create(
                question=question,
                text=answer_text,
                raw=answer_raw,
                draft=False,
            )

        self.stdout.write(self.style.SUCCESS('Successfully loaded and indexed all questions from the JSON file.'))
