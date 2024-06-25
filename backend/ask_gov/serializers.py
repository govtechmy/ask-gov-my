# ask_gov/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Agency, Question

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
