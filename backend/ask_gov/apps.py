from django.apps import AppConfig


class AskGovConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ask_gov'

    def ready(self):
        import ask_gov.signals
