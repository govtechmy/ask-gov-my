# ask_gov/serializers.py
from rest_framework import serializers
from .models import Question, Agency, Topic

class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = ['id', 'name', 'acronym']

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'title']

class QuestionSerializer(serializers.ModelSerializer):
    agency = AgencySerializer()
    topics = TopicSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'question', 'date', 'state', 'agency', 'answer', 'topics', 'email']
