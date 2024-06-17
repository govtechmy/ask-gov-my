from django.shortcuts import render
from django.views.generic import TemplateView

class ProjectListView(TemplateView):
    template_name = 'projects.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context['results'] =
        return context
