from django.contrib import admin

# Register your models here.
# ask_gov/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import  Agency



admin.site.register()
admin.site.register(Agency)
