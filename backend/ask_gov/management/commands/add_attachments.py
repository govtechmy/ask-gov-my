import random
from django.core.management.base import BaseCommand
from ask_gov.models import Question 

class Command(BaseCommand):
    help = 'Add random attachments to each question'

    ATTACHMENTS = [
        'https://ask-gov.s3.ap-southeast-2.amazonaws.com/uploads/1721178829856-sample (1).pdf',
        'https://ask-gov.s3.ap-southeast-2.amazonaws.com/uploads/file-example_PDF_1MB.pdf',
        'https://ask-gov.s3.ap-southeast-2.amazonaws.com/uploads/lovepik-kuala-lumpur-landmark-twin-towers-png-image_401483213_wh1200.png',
        'https://ask-gov.s3.ap-southeast-2.amazonaws.com/uploads/random_pic121211111111111hdnaujdnowada.jpg',
        'https://ask-gov.s3.ap-southeast-2.amazonaws.com/uploads/robby-mccullough-iCoKBp2bZEU-unsplash.jpg',
        'https://ask-gov.s3.ap-southeast-2.amazonaws.com/uploads/SamplePDFFile_5mb.pdf',
        'https://ask-gov.s3.ap-southeast-2.amazonaws.com/uploads/Very+Important.png',
    ]

    def handle(self, *args, **kwargs):
        questions = Question.objects.all()
        for question in questions:
            question.attachment = []
            print(f"Clearing existing attachments for question {question.id}")

            num_attachments = random.randint(3, 7)
            attachments = random.sample(self.ATTACHMENTS, num_attachments)
            question.attachments = attachments
            question.save()

            for attachment in attachments:
                print(f"Adding attachment {attachment} to question {question.id}")

        self.stdout.write(self.style.SUCCESS('Successfully added random attachments to all questions'))