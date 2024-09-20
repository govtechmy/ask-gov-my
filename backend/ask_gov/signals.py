from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Question, Agency, Topic
from .serializers import QuestionSerializer
from .elasticsearch_client import client
from ask_gov.embed import get_embedding
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Question)
def index_question(sender, instance, **kwargs):
    serializer = QuestionSerializer(instance)
    document = serializer.data

    if instance.has_answer():
        document['answer'] = instance.answer.answer_preview

    document.pop('admin_isopen', None)
    document.pop('staff_isopen', None)
    document.pop('attachments', None)
    document.pop('email', None)
    document.pop('answer_preview', None)


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

    if instance.topics.exists():
        topics = instance.topics.all()
        topics_data = [
            {
                "id": topic.id,
                "name": topic.title,
                "name_ms": topic.title_ms
            }
            for topic in topics
        ]
    else:
        topics_data = []

    document['topics'] = topics_data

    logger.debug(f'Indexing document: {document}')

    document['vector'] = get_embedding(instance.question)

    client.delete(
        index='questions',
        id=str(instance.id),
        ignore=[404]
    )

    client.index(
        index='questions',
        id=str(instance.id),
        document=document
    )
