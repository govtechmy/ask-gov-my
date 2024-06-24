"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from plane.views import MinistryView, QuestionsView, QnAView, AnswerView
from search.views import SearchView, SearchAgenciesView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', MinistryView.as_view(), name='ministry'),
    path('questions', QuestionsView.as_view(), name='questions'),
    path('answer/<uuid:agency_id>/<uuid:question_id>', AnswerView.as_view(), name='answer'),
    path('question/<uuid:id>', QnAView.as_view(), name='question'),
    path('search', SearchView.as_view(), name='search'),
    path('agency-search', SearchAgenciesView.as_view(), name='agency_search'),
]
