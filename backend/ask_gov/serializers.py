from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Agency, Question, Topic, User, Account, Session, VerificationToken

User = get_user_model()

class AgencySerializer(serializers.ModelSerializer):
    total_likes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Agency
        fields = ['id', 'name', 'name_ms', 'acronym', 'total_likes', 'logo_url', 'last_edited']

class TopicSerializer(serializers.ModelSerializer):
    agency = AgencySerializer()

    class Meta:
        model = Topic
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    topics = serializers.PrimaryKeyRelatedField(many=True, queryset=Topic.objects.all(), required=False)

    class Meta:
        model = Question
        fields = '__all__'

    def create(self, validated_data):
        topics = validated_data.pop('topics', [])
        question = Question.objects.create(**validated_data)
        
        for topic in topics:
            question.topics.add(topic)
        
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