from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.utils import timezone

from .managers import CustomUserManager

class User(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(max_length=30, blank=True, unique=True, default='')
    password = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100, blank=True, default='')
    last_name = models.CharField(max_length=100, blank=True, default='')

    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def get_full_name(self):
        return self.first_name

    def __str__(self):
        return self.email
    
class  Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Category(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#ff0000')

    def __str__(self):
        return self.name
    
class Task(models.Model): 
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date_create = models.DateTimeField(auto_now_add=True)
    date_deadline = models.DateTimeField(blank=True)
    is_done = models.BooleanField(default=False)
    is_started = models.BooleanField(default=False)
    by_who = models.CharField(max_length=100, default='')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title