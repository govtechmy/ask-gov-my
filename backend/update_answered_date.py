import random
import django
import os
from datetime import timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from ask_gov.models import Question

def update_answered_date():
    questions = Question.objects.all()
    for question in questions:
        question.answeredDate = question.date
        question.save()
        print(f"Updated Question ID {question.id} with answeredDate {question.answeredDate}")

if __name__ == "__main__":
    update_answered_date()
