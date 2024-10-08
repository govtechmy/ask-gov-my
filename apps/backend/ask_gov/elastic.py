import logging
from django.conf import settings
from elasticsearch import Elasticsearch
from .embed import get_embedding
from .serializers import QuestionSerializer
from .models import Question

ELASTICSEARCH_URL = settings.ELASTICSEARCH_URL
ELASTICSEARCH_API_KEY = settings.ELASTICSEARCH_API_KEY
QUESTION_INDEX = settings.ELASTICSEARCH_QUESTION_INDEX
EMBEDDING_ENABLED = settings.FEATURE_FLAGS.get("EMBEDDING")

client = Elasticsearch(
    [ELASTICSEARCH_URL],
    api_key=ELASTICSEARCH_API_KEY,
)

logger = logging.getLogger(__name__)

def index_question(question: Question):
        serializer = QuestionSerializer(question)

        document = serializer.data
        if EMBEDDING_ENABLED:
            try:
                document['vector'] = get_embedding(question.question)
            except Exception as e:
                logger.error(f"Failed to get embedding for question: {question.id}. Error: {str(e)}")

        client.index(
            index=QUESTION_INDEX,
            id=str(question.id),
            document=document
        )