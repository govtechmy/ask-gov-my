from django.shortcuts import render

from rest_framework import generics
from .models import Question, Agency
from .serializers import QuestionSerializer, AgencySerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuestionDetailView(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class AgencyListView(generics.ListAPIView):
    queryset = Agency.objects.all()
    serializer_class = AgencySerializer

@api_view(['POST'])
def submit_question(request, agency_id):
    try:
        agency = Agency.objects.get(pk=agency_id)
        question_text = request.data.get('question')
        question = Question.objects.create(question=question_text, agency=agency)
        return Response({"message": "Question submitted successfully"})
    except Agency.DoesNotExist:
        return Response({"error": "Agency not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
