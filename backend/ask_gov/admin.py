from django.contrib import admin

# Register your models here.
# ask_gov/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Agency

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('agency',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('agency',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Agency)
