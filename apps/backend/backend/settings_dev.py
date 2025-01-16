# Overwrite some base settings for development
# Load these settings with manage.py runserver --settings 'backend.settings_dev'

from .settings import *

DEBUG = True
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"