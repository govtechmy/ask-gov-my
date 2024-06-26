from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Question
from .serializers import QuestionSerializer
from .elasticsearch_client import client

@receiver(post_save, sender=Question)
def index_question(sender, instance, **kwargs):
    serializer = QuestionSerializer(instance)
    document = serializer.data

    client.index(
        index='questions',
        id=str(instance.id),
        document=document
    )
