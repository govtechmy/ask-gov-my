from django.db import models
from django.contrib.auth.models import AbstractUser

class Agency(models.Model):
    name = models.CharField(max_length=255)
    name_ms = models.CharField(max_length=255, null=True, blank=True)
    acronym = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name

class Topic(models.Model):
    title = models.CharField(max_length=255)
    title_ms = models.CharField(max_length=255, null=True, blank=True)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class CustomUser(AbstractUser):
    agency = models.OneToOneField(Agency, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.username

class Question(models.Model):
    BACKLOG = 'backlog'
    COMPLETED = 'completed'
    SPAM = 'spam'
    
    STATE_CHOICES = [
        (BACKLOG, 'Backlog'),
        (COMPLETED, 'Completed'),
        (SPAM, 'Spam'),
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


    def __str__(self):
        return self.question[:50]