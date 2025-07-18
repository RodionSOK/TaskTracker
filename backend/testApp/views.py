from rest_framework import generics, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Task, Category, Project, User
from .serialiers import TaskSerializer, CategorySerializer, UserSerializer, ProjectSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class TaskViewSet(APIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        tasks =Task.objects.all()
        return Response({"tasks": TaskSerializer(tasks, many=True).data})
    
    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"task": serializer.data})
    
    def put(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Method PUT not allowed"})
        
        try:
            instance = Task.objects.get(pk=pk)
        except:
            return Response({"error": "Object does not exist"})
        
        serializer = TaskSerializer(data=request.data, instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"task": serializer.data})
    
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Method DELET not allowed"})
        
        try:
            instance = Task.objects.get(pk=pk)
        except:
            return Response({"error": "Object does not exist"})
        
        instance.delete()

        return Response({"task": "delete task" + str(pk)})

class CategoryViewSet(APIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all()
        return Response({"categories": CategorySerializer(categories, many=True).data})
    
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'category': serializer.data})
    
    def put(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Method PUT not allowed"})
        
        try:
            instance = Category.objects.get(pk=pk)
            print(instance.name)
        except:
            return Response({"error": "Object does not exist"})
        
        serializer = CategorySerializer(data=request.data, instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"category": serializer.data})
    
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Method DELETE not allowed"})
        
        try: 
            instance = Category.objects.get(pk=pk)
        except:
            return Response({"error": "Object does not exist"})
        
        instance.delete()

        return Response({"category": "delete category" + str(pk)})

class ProjectViewSet(APIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        projects = Project.objects.all()
        return Response({"projects": ProjectSerializer(projects, many=True).data})
    
    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'project': serializer.data})
    
    def put(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": 'Method PUT not allowed'})
        
        try:
            instance = Project.objects.get(pk=pk)
        except:
            return Response({"error": "Object does not exist"})
        
        serializer = ProjectSerializer(data=request.data, instance=instance)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"project": serializer.data})
    
    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Method DELETE not allowed"})
        
        try:
            instance = Project.objects.get(pk=pk)
        except:
            return Response({"error": "Object does not exist"})
        
        instance.delete()

        return Response({"project": "delete post" + str(pk)})