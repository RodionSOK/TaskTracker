from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from rest_framework import generics, permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.conf import settings

from .models import Task, Category, Project, User
from .serialiers import TaskSerializer, CategorySerializer, UserSerializer, ProjectSerializer, MyTokenObtainPairSerializer
from smtplib import SMTPDataError

class MyTokenObtainPairView(TokenObtainPairView):
       serializer_class = MyTokenObtainPairSerializer

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'If this email exists, a reset link has been sent.'}, status=status.HTTP_200_OK)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}&uid={uid}"
        subject = "Восстановление пароля для Task Tracker"
        message = (
            f"Здравствуйте, {user.get_full_name() or user.email}!\n\n"
            f"Вы запросили восстановление пароля для вашего аккаунта на Task Tracker.\n"
            f"Чтобы сбросить пароль, перейдите по ссылке ниже:\n\n"
            f"{reset_url}\n\n"
            f"Если вы не запрашивали восстановление, просто проигнорируйте это письмо.\n\n"
            f"С уважением,\nКоманда Task Tracker"
        )
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except SMTPDataError as e:
            if b'SPAM' in getattr(e, 'smtp_error', b'') or b'SPAM' in str(e).encode():
                return Response({'error': 'Письмо временно не может быть отправлено. Пожалуйста, подождите несколько минут и попробуйте снова.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)
            raise
        return Response({'message': 'If this email exists, a reset link has been sent.'}, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        newPassword = request.data.get('newPassword')
        if not uidb64 or not token or not newPassword:
            return Response({'error': 'Missing data'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({'error': 'Invalid link'}, status=status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(newPassword)
        user.save()
        return Response({'message': 'Password has been reset.'}, status=status.HTTP_200_OK)

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
    
    def patch(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Method PATCH not allowed"})
        try:
            instance = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({"error": "Object does not exist"})
        serializer = TaskSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"task": serializer.data})

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
    
    def patch(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Method PATCH not allowed"})
        try:
            instance = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"error": "Object does not exist"})
        serializer = CategorySerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"category": serializer.data})

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
    
    def patch(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if not pk:
            return Response({"error": "Method PATCH not allowed"})
        try:
            instance = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({"error": "Object does not exist"})
        serializer = ProjectSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"project": serializer.data})