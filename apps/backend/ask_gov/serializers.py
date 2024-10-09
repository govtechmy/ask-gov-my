from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Agency, Answer, Question, Topic

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
        fields = ['id', 'question', 'raw', 'text', 'likes', 'draft', 'created_at', 'updated_at']
        read_only_fields = ['id', 'likes', 'created_at', 'updated_at']
    
    def validate_question(self, question):
        if question.spam:
            raise serializers.ValidationError("Cannot answer a question marked as spam.")
        if not question.agency:
            raise serializers.ValidationError("Cannot answer a question that does not have an agency.")
        return question

class QuestionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer(read_only=True)
    agency = AgencySerializer(read_only=True)

    class Meta:
        model = Question
        fields = ["id", "topics", "answer", "question", "spam", "email", "admin_opened_at", "staff_opened_at", "created_at", "updated_at", "agency"]
        read_only_fields = ["id", "topics", "answer", "spam", "admin_opened_at", "staff_opened_at", "created_at", "updated_at", "agency"]

class AdminPatchedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["spam", "agency"]
        write_only_fields = ["spam", "agency"]
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "agency", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
