from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.contrib.postgres.fields import ArrayField
from django_next_auth_adapter.models import (
    NextAuthUser, 
    NextAuthSession, 
    NextAuthAccount, 
    NextAuthVerificationRequest
)
import uuid

class Agency(models.Model):
    name = models.CharField(max_length=255)
    name_ms = models.CharField(max_length=255, null=True, blank=True)
    acronym = models.CharField(max_length=50, null=True, blank=True)
    logo_url = models.URLField(max_length=500, null=True, blank=True)
    last_edited = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Topic(models.Model):
    title = models.CharField(max_length=255)
    title_ms = models.CharField(max_length=255, null=True, blank=True)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Question(models.Model):
    BACKLOG = 'backlog'
    COMPLETED = 'completed'
    SPAM = 'spam'
    DRAFT = 'draft'
    
    STATE_CHOICES = [
        (BACKLOG, 'Backlog'),
        (COMPLETED, 'Completed'),
        (SPAM, 'Spam'),
        (DRAFT, 'Draft'),
    ]

    question = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=10, choices=STATE_CHOICES, default=BACKLOG)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, null=True, blank=True)
    answer = models.TextField(null=True, blank=True)
    topics = models.ManyToManyField(Topic, blank=True)
    email = models.EmailField()
    likes = models.IntegerField(default=0)  
    dislikes = models.IntegerField(default=0)
    attachments = ArrayField(models.URLField(), blank=True, default=list)
    admin_isopen = models.BooleanField(default=False)
    staff_isopen = models.BooleanField(default=False)
    answered_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.question[:50]
    
class UserRole(models.TextChoices):
    STAFF = 'staff', 'Staff'
    SUPER_ADMIN = 'super_admin', 'Super Admin'


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True)
    email_verified = models.DateTimeField(null=True, blank=True)
    image = models.URLField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.STAFF)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    agency = models.IntegerField(null=True, blank=True)
    user_profile_colour = models.CharField(max_length=50, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class Session(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_token = models.CharField(max_length=255, unique=True)
    expires = models.DateTimeField()

class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    provider = models.CharField(max_length=255)
    provider_account_id = models.CharField(max_length=255)
    access_token = models.CharField(max_length=255, null=True, blank=True)
    refresh_token = models.CharField(max_length=255, null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

class VerificationToken(models.Model):
    identifier = models.CharField(max_length=255)
    token = models.CharField(max_length=255)
    expires = models.DateTimeField()