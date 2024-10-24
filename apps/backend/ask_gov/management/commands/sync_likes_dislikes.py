from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models.signals import post_save
from ask_gov.models import Answer
from ask_gov.elastic import esclient
from ask_gov.signals import index_question

class Command(BaseCommand):
    help = 'Updates likes/dislikes count by counting documents from elasticsearch'

    def handle(self, *args, **kwargs):
        # Disconnect the index_question signal handler, we don't need to reindex
        # to elasticsearch
        post_save.disconnect(index_question, sender=Answer)

        for answer in Answer.objects.all():
            response = esclient.count(
                index=settings.ELASTICSEARCH_LIKE_DISLIKE_INDEX,
                query={
                    "bool": {
                        "must": [
                            { "match": { "type": "like" } },
                            { "match": { "answer_id": answer.id } },
                        ]
                    }
                },
                ignore_unavailable=True
            )
            answer.likes = response["count"]

            response = esclient.count(
                index=settings.ELASTICSEARCH_LIKE_DISLIKE_INDEX,
                query={
                    "bool": {
                        "must": [
                            { "match": { "type": "dislike" } },
                            { "match": { "answer_id": answer.id } },
                        ]
                    }
                },
                ignore_unavailable=True
            )
            answer.dislikes = response["count"]

            answer.save()

        self.stdout.write(self.style.SUCCESS('Successfully synced likes/dislikes'))
