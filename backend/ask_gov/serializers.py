from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Agency, Question, Topic

User = get_user_model()

class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ['id', 'name', 'acronym']

class UserSerializer(serializers.ModelSerializer):
    agency = AgencySerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'agency']

class QuestionSerializer(serializers.ModelSerializer):
    agency = AgencySerializer()
    class Meta:
        model = Question
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    agency = AgencySerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'agency']

class TopicSerializer(serializers.ModelSerializer):
    agency = AgencySerializer()

    class Meta:
        model = Topic
        fields = ['id', 'title', 'agency']