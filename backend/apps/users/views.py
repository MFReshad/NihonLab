from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from .models import User
from .serializers import UserSerializer
import logging

logger = logging.getLogger(__name__)

def get_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user with email and password
    Expected payload: { email, password, first_name?, last_name? }
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        # Validation
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'User with this email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            registration_method='email'
        )

        # Generate tokens
        tokens = get_tokens_for_user(user)

        # Serialize user data
        user_data = UserSerializer(user).data

        return Response({
            'message': 'User registered successfully',
            'user': user_data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f'Registration error: {str(e)}')
        return Response(
            {'error': 'Registration failed. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login with email and password
    Expected payload: { email, password }
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        # Validation
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate user
        user = authenticate(email=email, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'error': 'Account is not active'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate tokens
        tokens = get_tokens_for_user(user)

        # Serialize user data
        user_data = UserSerializer(user).data

        return Response({
            'message': 'Login successful',
            'user': user_data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Login error: {str(e)}')
        return Response(
            {'error': 'Login failed. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Authenticate user with Google OAuth
    Expected payload: { credential }
    """
    try:
        credential = request.data.get('credential')

        if not credential:
            return Response(
                {'error': 'Google credential is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify Google token
        try:
            # Replace with your Google Client ID
            GOOGLE_CLIENT_ID = getattr(settings, 'GOOGLE_CLIENT_ID', '713448377274-vkp9efs9nhm399l0cni208d83fuh4nl1.apps.googleusercontent.com')
            
            idinfo = id_token.verify_oauth2_token(
                credential, 
                requests.Request(), 
                GOOGLE_CLIENT_ID
            )

            print("Google ID info:", idinfo) 

            # Get user info from Google token
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            google_id = idinfo.get('sub')
            picture = idinfo.get('picture', '')

            if not email:
                return Response(
                    {'error': 'Unable to get email from Google'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if user exists
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'avatar_url': picture,
                    'registration_method': 'google',
                    'is_active': True,
                    
                }
            )

            # Update user info if they already existed
            if not created:
                if user.registration_method != 'google':
                    # User previously registered with email
                    return Response(
                        {'error': 'An account with this email already exists. Please login with email and password.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Update user info from Google
                user.first_name = first_name
                user.last_name = last_name
                user.avatar_url = picture
                user.save()

            # Generate tokens
            tokens = get_tokens_for_user(user)

            # Serialize user data
            user_data = UserSerializer(user).data

            return Response({
                'message': 'Google authentication successful',
                'user': user_data,
                'tokens': tokens
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            logger.error(f'Google token verification error: {str(e)}')
            return Response(
                {'error': 'Invalid Google token'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    except Exception as e:
        logger.error(f'Google auth error: {str(e)}')
        return Response(
            {'error': 'Google authentication failed. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """
    Get current user profile
    Requires authentication
    """
    try:
        user_data = UserSerializer(request.user).data
        return Response({
            'user': user_data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Profile error: {str(e)}')
        return Response(
            {'error': 'Failed to fetch profile'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout user by blacklisting refresh token
    Expected payload: { refresh_token }
    """
    try:
        refresh_token = request.data.get('refresh_token')
        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {'message': 'Logout successful'},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        logger.error(f'Logout error: {str(e)}')
        return Response(
            {'error': 'Logout failed'},
            status=status.HTTP_400_BAD_REQUEST
        )