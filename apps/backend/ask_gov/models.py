from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
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

class UserManager(BaseUserManager):
    def create_user(self, email, name, role, agency=None, password=None):
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            role=role,
            agency=agency,
        )
        user.clean()
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        """
        Creates and saves a superuser with the given email and name
        """
        user = self.create_user(
            email,
            name=name,
            role=UserRole.SUPER_ADMIN,
            password=password,
        )
        return user


class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField()
    email = models.EmailField(unique=True)
    image = models.URLField(null=True, blank=True)
    role = models.CharField(choices=UserRole.choices, default=UserRole.STAFF)
    agency = models.ForeignKey(Agency, null=True, blank=True, on_delete=models.PROTECT, related_name="agency")
    user_profile_colour = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        # `is_staff` is used by Django to determine if the user can login to Django admin
        return self.role == UserRole.SUPER_ADMIN


class Attachment(models.Model):
    answer = models.ForeignKey('Answer', related_name='attachments', on_delete=models.CASCADE)
    filekey = models.CharField(max_length=255, verbose_name="S3 File Key")
    filesize = models.PositiveIntegerField(verbose_name="File Size (bytes)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def filesize_mb(self):
        return round(self.filesize / (1024 * 1024), 2)
