from django.contrib import admin

# Register your models here.
# ask_gov/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import  Agency, User, Account, Session, VerificationToken



admin.site.register(Agency)
admin.site.register(User)
admin.site.register(Account)
admin.site.register(Session)
admin.site.register(VerificationToken)

