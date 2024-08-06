from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
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

class UserManager(BaseUserManager): #to handle user creation in django admin site
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', UserRole.SUPER_ADMIN)
        return self.create_user(email, password, **extra_fields)

class User(NextAuthUser, AbstractBaseUser, PermissionsMixin):
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

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class Account(NextAuthAccount):
    id = models.CharField(max_length=100, primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, related_name='accounts', on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    provider = models.CharField(max_length=50)
    provider_account_id = models.CharField(max_length=100)
    refresh_token = models.CharField(max_length=255, null=True, blank=True)
    access_token = models.CharField(max_length=255, null=True, blank=True)
    expires_at = models.IntegerField(null=True, blank=True)
    token_type = models.CharField(max_length=50, null=True, blank=True)
    scope = models.CharField(max_length=255, null=True, blank=True)
    id_token = models.CharField(max_length=255, null=True, blank=True)
    session_state = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        unique_together = ('provider', 'provider_account_id')

    def __str__(self):
        return f'{self.provider} account for {self.user.email}'

class Session(NextAuthSession):
    id = models.CharField(max_length=100, primary_key=True, default=uuid.uuid4, editable=False)
    session_token = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(User, related_name='sessions', on_delete=models.CASCADE)
    expires = models.DateTimeField()

    def __str__(self):
        return f'Session for {self.user.email}'

class VerificationToken(NextAuthVerificationRequest):
    identifier = models.CharField(max_length=255)
    token = models.CharField(max_length=255, unique=True)
    expires = models.DateTimeField()

    class Meta:
        unique_together = ('identifier', 'token')

    def __str__(self):
        return f'Verification token for {self.identifier}'