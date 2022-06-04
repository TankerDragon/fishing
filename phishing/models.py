from time import time
from turtle import mode
from django.db import models

# Create your models here.
class Fish(models.Model):
    channel_id = models.IntegerField()
    message_id = models.IntegerField()
    time = models.DateTimeField()
    text = models.TextField(max_length=2000)