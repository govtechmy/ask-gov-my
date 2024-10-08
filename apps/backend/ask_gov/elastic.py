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

def index_question(question: Question):
        serializer = QuestionSerializer(question)

        document = serializer.data
        if EMBEDDING_ENABLED:
            document['vector'] = get_embedding(question.question)

        client.index(
            index=QUESTION_INDEX,
            id=str(question.id),
            document=document
        )