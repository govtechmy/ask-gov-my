from modeltranslation.translator import translator, TranslationOptions
from .models import Agency, Topic

class TopicTranslationOptions(TranslationOptions):
    fields = ["title"]
    required_languages = ("ms", "en")

class AgencyTranslationOptions(TranslationOptions):
    fields = ["name"]
    required_languages = ("ms", "en")

translator.register(Topic, TopicTranslationOptions)
translator.register(Agency, AgencyTranslationOptions)