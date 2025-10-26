from django.shortcuts import render
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from .models import User


@api_view(['GET'])
def Home(request):
    return Response({"message": "Hello world"})


@api_view(["POST"])
@permission_classes([AllowAny])  # Add this if you want to allow unauthenticated requests
def google_auth(request):
    """
    Authenticate user with Google OAuth token.
    Expects 'credential' field in request body.
    """
    print("=" * 50)
    print("Request data:", request.data)  # Keep only this print
    print("=" * 50)
    
    token = request.data.get("credential")
    
    if not token:
        return Response(
            {"error": "Token not provided", "status": False}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Verify the Google OAuth token
        id_info = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            settings.GOOGLE_OAUTH_CLIENT_ID
        )

        print("ID Info:", id_info)

        # Extract user information from token
        email = id_info.get('email')
        if not email:
            return Response(
                {"error": "Email not found in token", "status": False},
                status=status.HTTP_400_BAD_REQUEST
            )

        first_name = id_info.get('given_name', '')
        last_name = id_info.get('family_name', '')
        profile_pic_url = id_info.get('picture', '')

        # Get or create user
        user, created = User.objects.get_or_create(email=email)
        
        if created:
            # New user - set up their account
            user.set_unusable_password()
            user.first_name = first_name
            user.last_name = last_name
            user.registration_method = 'google'
            user.save()
            print(f"Created new user: {email}")
        else:
            # Existing user - verify they registered with Google
            if user.registration_method != 'google':
                return Response(
                    {
                        "error": "This email is registered with a different method. Please sign in using email/password.",
                        "status": False
                    }, 
                    status=status.HTTP_403_FORBIDDEN
                )
            print(f"Existing user logged in: {email}")

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response(
            {
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                "user": {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "status": True
            },
            status=status.HTTP_200_OK
        )

    except ValueError as e:
        print(f"Token verification failed: {str(e)}")
        return Response(
            {"error": "Invalid token", "status": False}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return Response(
            {"error": "Authentication failed", "status": False},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )