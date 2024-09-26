from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Agency, Answer, Question, Topic, User, Account, Session, VerificationToken
from .elasticsearch_client import client

User = get_user_model()

class AgencySerializer(serializers.ModelSerializer):
    total_likes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Agency
        fields = ['id', 'name', 'name_ms', 'acronym', 'total_likes', 'logo_url', 'updated_at']

    def update(self, instance, validated_data):
        super().update(instance, validated_data)

        # Re-index the question in ElasticSearch with agency
        agency = instance
        questions = Question.objects.filter(agency=agency)
        for question in questions:
            client.update(
                index='questions',
                id=str(question.id),
                body={
                    "doc": {
                        "agency.id": agency.id,
                        "agency.name": agency.name,
                        "agency.acronym": agency.acronym,
                        "agency.name_ms": agency.name_ms,
                    }
                }
            )
        
        return agency

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'raw', 'text', 'likes', 'draft', 'created_at', 'updated_at']
        read_only_fields = ['id', 'raw', 'text', 'likes', 'draft', 'created_at', 'updated_at']

class QuestionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ["id", "topics", "answer", "question", "spam", "email", "admin_opened_at", "staff_opened_at", "created_at", "updated_at", "agency"]
        read_only_fields = ["id", "topics", "answer", "spam", "admin_opened_at", "staff_opened_at", "created_at", "updated_at", "agency"]

    def create(self, validated_data):
        question = Question.objects.create(**validated_data)

        # Index the question in ElasticSearch
        document = validated_data
        document['agency'] = {
            "id": "",
            "name": "",
            "acronym": "",
            "name_ms": ""
        }
        client.index(
            index='questions',
            id=str(question.id),
            document=document
        )
        
        return question
    

class AdminPatchedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["spam", "agency"]
        write_only_fields = ["spam", "agency"]

    def update(self, instance, validated_data):
        super().update(instance, validated_data)

        if "agency" in validated_data:
            # Re-index the question in ElasticSearch with agency
            agency = validated_data["agency"]
            agency_data = {
                "id": agency.id,
                "name": agency.name,
                "acronym": agency.acronym,
                "name_ms": agency.name_ms
            }
            client.update(
                index='questions',
                id=str(instance.id),
                body={
                    "doc": {
                        "agency": agency_data
                    }
                }
            )

        return instance
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "agency", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'

class VerificationTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationToken
        fields = '__all__'