import uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

# Create your models here.


class Boards(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(get_user_model(), default=None, on_delete=models.CASCADE)
    name = models.CharField(verbose_name='Board Name', max_length=50, unique=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Lists(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    board = models.ForeignKey(Boards, on_delete=models.CASCADE)
    name = models.CharField(verbose_name='List Name', max_length=100)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Tasks(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    list = models.ForeignKey(Lists, on_delete=models.CASCADE)
    title = models.CharField(verbose_name='Task Name', max_length=100)
    completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title
