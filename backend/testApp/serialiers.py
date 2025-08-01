from rest_framework import serializers 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Task, Category, User, Project
from django.contrib.auth.hashers import make_password

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
       @classmethod
       def get_token(cls, user):
           token = super().get_token(user)
           # Добавьте нужные поля:
           token['first_name'] = user.first_name
           token['email'] = user.email
           token['last_name'] = user.last_name
           return token


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
    text_color = serializers.SerializerMethodField()
    project = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Project.objects.all()
    )

    def get_text_color(self, obj):
        return obj.text_color

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
        fields = ['id', 'project', 'name', 'color', 'text_color']

class TaskSerializer(serializers.ModelSerializer):
    # project = serializers.SlugRelatedField(
    #     slug_field='name',
    #     queryset=Project.objects.all()
    # )
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )
    
    def create(self, validated_data):
        task = Task.objects.create(
            title=validated_data['title'],
            description=validated_data['description'],
            date_deadline=validated_data['date_deadline'],
            is_done=validated_data['is_done'],
            is_started=validated_data['is_started'],
            is_continued=validated_data['is_continued'],
            by_who=validated_data['by_who'],
            category=validated_data['category'],
            date_start=validated_data['date_start'],
            project=validated_data['project'],
        )

        return task
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.date_start = validated_data.get("date_start", instance.date_start)
        instance.date_deadline = validated_data.get("date_deadline", instance.date_deadline)
        instance.is_continued = validated_data.get("is_continued", instance.is_continued)
        instance.is_done = validated_data.get("is_done", instance.is_done)
        instance.is_started = validated_data.get("is_started", instance.is_started)
        instance.by_who = validated_data.get("by_who", instance.by_who)
        instance.category = validated_data.get("category", instance.category)
        instance.save()

        return instance

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'title', 'category', 'category_id',
            'description', 'date_start', 'date_deadline',
            'is_done', 'by_who', 'is_started', 'is_continued',
        ]

class ProjectSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    tasks_total = serializers.IntegerField(read_only=True)
    tasks_completed = serializers.IntegerField(read_only=True)
    tasks = TaskSerializer(many=True, read_only=True, source='task_set')
    invites = serializers.ListField(
        child=serializers.EmailField(),
        write_only=True,
        required=False
    )
    
    def create(self, validated_data):
        invites = validated_data.pop('invites', [])
        project = Project.objects.create(
            user=validated_data['user'],
            name=validated_data["name"],
            is_favorite=validated_data.get("is_favorite", False),
        )
        for email in invites:
            print(email)
        return project

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.is_favorite = validated_data.get("is_favorite", instance.is_favorite)
        instance.save()

        return instance

    class Meta:
        model = Project
        fields = ['id', 'user', 'name', 'tasks', 'tasks_total', 'tasks_completed', 'is_favorite', 'invites']