from django.conf import settings
from rest_framework import serializers, exceptions, status
from django.contrib.auth import get_user_model
from .models import Agency, Answer, Attachment, Question, Topic
import requests

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

class AdminAnswerSerializer(AnswerSerializer):
    class Meta(AnswerSerializer.Meta):
        fields = AnswerSerializer.Meta.fields + ['dislikes']
        read_only_fields = AnswerSerializer.Meta.read_only_fields + ['dislikes']

class QuestionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer(read_only=True)
    agency = AgencySerializer(read_only=True)
    attachments = AttachmentSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = ["id", "topics", "answer", "question", "spam", "email", "admin_opened_at", "staff_opened_at", "created_at", "updated_at", "agency", "attachments"]
        read_only_fields = ["id", "topics", "answer", "spam", "admin_opened_at", "staff_opened_at", "created_at", "updated_at", "agency", "attachments"]
    
    def create(self, validated_data):
        # Don't create questions with this model serializer, use
        # AskQuestionSerializer instead.
        pass

RECAPTCHA_SITE_KEY = settings.RECAPTCHA_SITE_KEY
RECAPTCHA_MIN_SCORE = settings.RECAPTCHA_MIN_SCORE
GOOGLE_PROJECT_ID = settings.GOOGLE_PROJECT_ID
GOOGLE_API_KEY = settings.GOOGLE_API_KEY

class AskQuestionSerializer(serializers.Serializer):
    question = serializers.CharField(max_length=255, required=True)
    email = serializers.EmailField(max_length=255, required=True)
    recaptcha_token = serializers.CharField(required=True)

    def create(self, validated_data):
        recaptcha_token = validated_data["recaptcha_token"]

        # Assess the recaptcha token
        response = requests.post(
            f"https://recaptchaenterprise.googleapis.com/v1/projects/{GOOGLE_PROJECT_ID}/assessments?key={GOOGLE_API_KEY}",
            json={
                "event": {
                    "token": recaptcha_token,
                    "expectedAction": "SUBMIT_QUESTION",
                    "siteKey": RECAPTCHA_SITE_KEY,
                }
            }
        )
        if response.status_code != status.HTTP_200_OK:
            raise exceptions.server_error(self.request)

        json_data = response.json()
        if json_data["riskAnalysis"]["score"] < RECAPTCHA_MIN_SCORE:
            raise exceptions.ValidationError("Recaptcha token failed to pass assessment")

        # Save the question after the recaptcha token passes the assessment
        question = Question(
            question=validated_data["question"],
            email=validated_data["email"],
        )
        question.save()

        return validated_data

class AdminQuestionSerializer(QuestionSerializer):
    answer = AdminAnswerSerializer(read_only=True)

    class Meta(QuestionSerializer.Meta):
        pass

class AdminPatchedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["spam", "agency"]
        write_only_fields = ["spam", "agency"]

class AssignTopicsToQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["topics"]
    
    def validate(self, data):
        """
        Validate topics belong to the correct agency.
        """
        question = self.instance
        question_agency_id = question.agency.id
        topics = data.get("topics", [])

        topics_from_other_agency = []

        for topic in topics:
            if topic.agency.id != question_agency_id:
                topics_from_other_agency.append(topic.id)
        
        if len(topics_from_other_agency) > 0:
            raise serializers.ValidationError(f"Invalid topics (from other agency): {topics_from_other_agency}")
        
        return data
    
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
