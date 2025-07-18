from django.contrib import admin
from .models import Task, Category, User, Project

admin.site.register(Project)
admin.site.register(User)
admin.site.register(Task)
admin.site.register(Category)