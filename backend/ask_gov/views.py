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

class SubmitQuestionView(APIView):
    def post(self, request, agency_id):
        try:
            agency = Agency.objects.get(id=agency_id)
        except Agency.DoesNotExist:
            return Response({"error": "Agency not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.get('data')
        serializer = QuestionSerializer(data=data)
        if serializer.is_valid():
            serializer.save(agency=agency)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_questions_by_agency(request, agency_id):
    try:
        agency = Agency.objects.get(pk=agency_id)
        questions = Question.objects.filter(agency=agency)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)
    except Agency.DoesNotExist:
        return Response({"error": "Agency not found"}, status=404)
