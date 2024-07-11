import csv
from django.core.management.base import BaseCommand
from ask_gov.models import Agency, Question, Topic

class Command(BaseCommand):
    help = 'Load questions from a CSV file into the database'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['csv_file']

        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                question_text = row['Question']
                answer_text = row['Answer']
                agency_name = row['Agency']

                agency = Agency.objects.get(name=agency_name)

                question = Question.objects.create(
                    question=question_text,
                    answer=answer_text,
                    agency=agency,
                    state='completed',  
                    email="example@example.com" 
                )

                self.stdout.write(self.style.SUCCESS(f'Successfully added question "{question_text}"'))

        self.stdout.write(self.style.SUCCESS('Successfully loaded all questions from the CSV file.'))
