from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Agency, Answer, Attachment, Question, Topic

User = get_user_model()

class AgencySerializer(serializers.ModelSerializer):
    # Translated fields must be required
    name_ms = serializers.CharField(required=True)
    name_en = serializers.CharField(required=True)

    class Meta:
        model = Agency
        fields = ['id', 'name', 'name_ms', 'name_en', 'acronym', 'logo_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'name', 'created_at', 'updated_at']

class TopicSerializer(serializers.ModelSerializer):
    # Translated fields must be required
    title_ms = serializers.CharField(required=True)
    title_en = serializers.CharField(required=True)

    class Meta:
        model = Topic
        fields = ['id', 'title', 'title_ms', 'title_en', 'agency', 'created_at', 'updated_at']
        read_only_fields = ['id', 'title', 'created_at', 'updated_at']

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ["id", "question", "file_key", "file_size", "file_size_mb"]
        read_only_fields = ["id"]
        extra_kwargs = {
                "question": {"write_only": True}
        }

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
    attachments = AttachmentSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = ["id", "topics", "answer", "question", "spam", "email", "admin_opened_at", "staff_opened_at", "created_at", "updated_at", "agency", "attachments"]
        read_only_fields = ["id", "topics", "answer", "spam", "admin_opened_at", "staff_opened_at", "created_at", "updated_at", "agency", "attachments"]

class AdminPatchedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["spam", "agency"]
        write_only_fields = ["spam", "agency"]
    
class UserSerializer(serializers.ModelSerializer):
    agency = AgencySerializer()

    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "agency", "created_at", "updated_at"]
        read_only_fields = ["id", "agency", "created_at", "updated_at"]

class CreateUpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "agency", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

class LikeDislikeSerializer(serializers.Serializer):
    # An arbitrary string to identify the anonymous user who performed the like/dislike.
    # The value could be an IP address, user agent string, token, etc.
    actor_id = serializers.CharField(required=True)

    ip_address = serializers.IPAddressField(required=True)
