from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Sum
import uuid


class AgencyManager(models.Manager):
    def trending(self):
        return self.get_queryset().annotate(total_likes=Sum('questions__answer__likes')).order_by('-total_likes')

class Agency(models.Model):
    name = models.CharField()
    name_ms = models.CharField(null=True, blank=True)
    acronym = models.CharField(max_length=50, null=True, blank=True)
    logo_url = models.URLField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AgencyManager()

    def __str__(self):
        return self.name


class Topic(models.Model):
    title = models.CharField()
    title_ms = models.CharField(null=True, blank=True)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class QuestionManager(models.Manager):
    def trending(self):
        return self.get_queryset().filter(answer__isnull=False, answer__draft=False).order_by('-answer__likes', 'id')

class Question(models.Model):
    question = models.CharField(max_length=255)
    spam = models.BooleanField(default=False)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, null=True, blank=True, related_name='questions')
    topics = models.ManyToManyField(Topic, blank=True)
    email = models.EmailField()
    admin_opened_at = models.DateTimeField(null=True, blank=True)
    staff_opened_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
    draft = models.BooleanField()
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
    agency = models.IntegerField(null=True, blank=True)
    user_profile_colour = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Attachment(models.Model):
    answer = models.ForeignKey('Answer', related_name='attachments', on_delete=models.CASCADE)
    filekey = models.CharField(max_length=255, verbose_name="S3 File Key")
    filesize = models.PositiveIntegerField(verbose_name="File Size (bytes)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def filesize_mb(self):
        return round(self.filesize / (1024 * 1024), 2)
