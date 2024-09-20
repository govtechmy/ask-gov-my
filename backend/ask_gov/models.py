from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
import uuid


class Agency(models.Model):
    name = models.CharField()
    name_ms = models.CharField(null=True, blank=True)
    acronym = models.CharField(max_length=50, null=True, blank=True)
    logo_url = models.URLField(max_length=500, null=True, blank=True)
    last_edited = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Topic(models.Model):
    title = models.CharField()
    title_ms = models.CharField(null=True, blank=True)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class QuestionManager(models.Manager):
    def trending(self):
        return self.get_queryset().filter(state='completed').order_by('-answer__likes', 'id')

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
    created_at = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=10, choices=STATE_CHOICES, default=BACKLOG)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, null=True, blank=True, related_name='questions')
    topics = models.ManyToManyField(Topic, blank=True)
    email = models.EmailField()
    attachments = ArrayField(models.URLField(), blank=True, default=list)
    admin_isopen = models.BooleanField(default=False)
    staff_isopen = models.BooleanField(default=False)

    objects = QuestionManager()

    def has_answer(self):
        return hasattr(self, 'answer')

    def __str__(self):
        return self.question[:50]


class Answer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    raw = models.CharField()
    text = models.CharField()
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    version = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.answer_preview[:50]


class UserRole(models.TextChoices):
    STAFF = 'staff', 'Staff'
    SUPER_ADMIN = 'super_admin', 'Super Admin'


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(null=True, blank=True)
    email = models.EmailField(unique=True)
    email_verified = models.DateTimeField(null=True, blank=True)
    image = models.URLField(null=True, blank=True)
    role = models.CharField(choices=UserRole.choices, default=UserRole.STAFF)
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
    session_token = models.CharField(unique=True)
    expires = models.DateTimeField()


class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    provider = models.CharField()
    provider_account_id = models.CharField()
    access_token = models.CharField(null=True, blank=True)
    refresh_token = models.CharField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)


class VerificationToken(models.Model):
    identifier = models.CharField()
    token = models.CharField()
    expires = models.DateTimeField()
