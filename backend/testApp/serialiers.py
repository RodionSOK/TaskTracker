from rest_framework import serializers 
from .models import Task, Category, User, Project
from django.contrib.auth.hashers import make_password

class TaskSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        task = Task.objects.create(
            title=validated_data['title'],
            description=validated_data['description'],
            date_deadline=validated_data['date_deadline'],
            is_done=validated_data['is_done'],
            is_started=validated_data['is_started'],
            by_who=validated_data['by_who'],
            category=validated_data['category'],
        )

        return task
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.date_deadline = validated_data.get("date_deadline", instance.date_deadline)
        instance.is_done = validated_data.get("is_done", instance.is_done)
        instance.is_started = validated_data.get("is_started", instance.is_started)
        instance.by_who = validated_data.get("by_who", instance.by_who)
        instance.category = validated_data.get("category", instance.category)
        instance.save()

        return instance

    class Meta:
        model = Task
        fields = ['title', 'category', 'description', 'date_create', 'date_deadline', 'is_done', 'by_who', 'is_started']

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(
        write_only=True,
        required=True,
    )

    password2 = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = ['email', 'password1', 'password2', 'first_name', 'last_name']

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2": "Different passwords."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=make_password(validated_data['password1']),
        )
        return user


class CategorySerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        category = Category.objects.create(
            project=validated_data['project'],
            name=validated_data['name'],
            color=validated_data['color'],
        )

        return category
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.color = validated_data.get("color", instance.color)
        instance.save()

        return instance
        

    class Meta:
        model = Category
        fields = ['project', 'name', 'color']

class ProjectSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return Project.objects.create(
            user=validated_data['user'],
            name=validated_data["name"],
        )
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.save()

        return instance

    class Meta:
        model = Project
        fields = ['user', 'name']