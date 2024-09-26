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

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['raw', 'text', 'likes', 'draft', 'created_at', 'updated_at']
        read_only_fields = ['text', 'likes', 'draft', 'created_at', 'updated_at']

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

    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

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