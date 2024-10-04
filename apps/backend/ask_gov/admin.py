from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.models import Group
from .models import Agency, User

admin.site.register(Agency)

"""
Since we use a custom User model, we'll need to subclass Django's UserAdmin and
the user forms to get the admin app to work.
"""

class UserCreationForm(forms.ModelForm):
    """
    A form for creating new users.
    """
    class Meta:
        model = User
        fields = ["email", "name", "role", "agency"]

class UserChangeForm(forms.ModelForm):
    """
    A form for updating users. Includes all the fields on the user, but replaces
    the password field with admin's disabled password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ["email", "password", "name", "role"]

class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["name", "email", "role", "agency"]
    list_filter = ["role", "agency"]
    fieldsets = [
        (None, {"fields": ["name", "email", "password", "role", "agency"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["name", "email", "role", "agency"],
            },
        ),
    ]
    search_fields = ["name", "email"]
    ordering = ["name"]
    filter_horizontal = []

# Register the new UserAdmin...
admin.site.register(User, UserAdmin)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
admin.site.unregister(Group)