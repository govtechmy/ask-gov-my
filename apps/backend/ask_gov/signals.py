from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Answer
from . import elastic
import logging

logger = logging.getLogger(__name__)

QUESTION_INDEX = settings.ELASTICSEARCH_QUESTION_INDEX

@receiver(post_save, sender=Answer)
def index_question(sender, instance, **kwargs):
    """
    Index an answered question to Elasticsearch.
    """
    elastic.index_question(instance.question)