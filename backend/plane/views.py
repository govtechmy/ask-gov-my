from django.views.generic import TemplateView

from plane.plane import Plane

plane = Plane()


class MinistryView(TemplateView):
    template_name = 'ministry.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['agencies'] = plane.get_agencies()
        return context


class QnAView(TemplateView):
    template_name = 'qna.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['qna'] = plane.get_question_by_agency(kwargs['id'])
        return context
