from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Question, Agency
from .serializers import QuestionSerializer
from .elasticsearch_client import client

@receiver(post_save, sender=Question)
def index_question(sender, instance, **kwargs):
    serializer = QuestionSerializer(instance)
    document = serializer.data

    if document['agency'] is None:
        agency_data = {
            "id": "",
            "name": "",
            "acronym": "",
            "name_ms": ""
        }
    else:
        agency_id = int(document['agency'])
        agency = Agency.objects.get(id=agency_id)
        agency_data = {
            "id": agency.id,
            "name": agency.name,
            "acronym": agency.acronym,
            "name_ms": agency.name_ms
        }

    document['agency'] = agency_data

    client.index(
        index='questions',
        id=str(instance.id),
        document=document
    )
