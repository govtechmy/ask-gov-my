from django.views.generic import TemplateView

from search.es import BonsaiSearch


class ProjectListView(TemplateView):
    template_name = 'projects.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context['results'] =
        return context


class SearchView(TemplateView):
    template_name = 'search.html'


class SearchAgenciesView(TemplateView):
    template_name = 'search_result.html'

    def post(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        query = self.request.POST['query']
        es = BonsaiSearch()
        context['search_result'] = es.search(index='askgovmy', query=query)
        return context
