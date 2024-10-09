from django.conf import settings
from django.core.management.base import BaseCommand
from ask_gov.models import Question
from apps.backend.ask_gov.elastic import index_question

QUESTION_INDEX = settings.ELASTICSEARCH_QUESTION_INDEX

class Command(BaseCommand):
    help = 'Indexes all answered questions into Elasticsearch.'

    def handle(self, *args, **kwargs):
        questions = Question.objects.filter(answer__isnull=False)
        for question in questions:
            index_question(question)

        self.stdout.write(self.style.SUCCESS(f'Successfully indexed {len(questions)} questions.'))
