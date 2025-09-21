from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.utils import timezone
from datetime import timedelta

from .managers import CustomUserManager

class User(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(max_length=30, blank=True, unique=True, default='')
    password = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100, blank=True, default='')
    last_name = models.CharField(max_length=100, blank=True, default='')

    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)  # <-- новое поле

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
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_projects")
    owners = models.ManyToManyField(User, related_name="owner_projects", blank=True)
    members = models.ManyToManyField(User, related_name="member_projects", blank=True)
    name = models.CharField(max_length=100, unique=True)
    is_favorite = models.BooleanField(default=False) 

    def __str__(self):
        return self.name
    
    @property
    def tasks_total(self):
        return self.task_set.count()
    
    @property
    def tasks_completed(self):
        return self.task_set.filter(is_done=True).count()
    
class Category(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#cccccc')

    @property
    def text_color(self, factor=0.4):
        hex_color = self.color.lstrip('#')
        rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        dark_rgb = tuple(int(c * factor) for c in rgb)
        return '#{:02x}{:02x}{:02x}'.format(*dark_rgb)

    def __str__(self):
        return self.name
    
class Task(models.Model): 
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date_start = models.DateTimeField(blank=True, null=True)
    date_deadline = models.DateTimeField(blank=True, null=True, default=timezone.now() + timedelta(days=21))
    is_done = models.BooleanField(default=False)
    is_started = models.BooleanField(default=False)
    is_continued = models.BooleanField(default=False)
    is_favorite = models.BooleanField(default=False)
    by_who = models.CharField(max_length=100, default='')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.title