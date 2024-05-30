from django.conf import settings
from django.http import JsonResponse
from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import UserSerializer, LoginUserSerializer
from requests_oauthlib import OAuth2Session
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from pkce import generate_pkce_pair

AUTH_BASE_URL = f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize"
TOKEN_URL = f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID}/oauth2/v2.0/token"
USER_INFO_URL = 'https://graph.microsoft.com/v1.0/me'

@api_view(['GET'])
@permission_classes([AllowAny])
@extend_schema(summary="Microsoft authentication")
def microsoft_login(request):
    code_verifier, code_challenge = generate_pkce_pair()
    request.session['code_verifier'] = code_verifier

    oauth = OAuth2Session(settings.MICROSOFT_CLIENT_ID, redirect_uri=settings.MICROSOFT_REDIRECT_URI, scope=settings.MICROSOFT_SCOPES)
    authorization_url, state = oauth.authorization_url(AUTH_BASE_URL, code_challenge=code_challenge, code_challenge_method='S256')
    request.session['oauth_state'] = state
    return redirect(authorization_url)

@api_view(['GET'])
@permission_classes([AllowAny])
@extend_schema(summary="Microsoft authentication callback")
def microsoft_callback(request):
    code_verifier = request.session.get('code_verifier')
    if not code_verifier:
        return JsonResponse({'error': 'Missing code verifier'}, status=400)

    oauth = OAuth2Session(settings.MICROSOFT_CLIENT_ID, redirect_uri=settings.MICROSOFT_REDIRECT_URI, state=request.session['oauth_state'])
    token = oauth.fetch_token(TOKEN_URL, client_secret=settings.MICROSOFT_CLIENT_SECRET, authorization_response=request.build_absolute_uri(), code_verifier=code_verifier)
    request.session['oauth_token'] = token
    return redirect('microsoft-auth-complete')

def get_school_from_email(email):
    domain_mapping = {
        'epita.fr': 'epita',
        'epitech.eu': 'epitech',
    }
    
    domain = email.split('@')[-1]
    return domain_mapping.get(domain, 'unknown')

@api_view(['GET'])
@permission_classes([AllowAny])
@extend_schema(summary="Complete Microsoft authentication")
def microsoft_auth_complete(request):
    oauth = OAuth2Session(settings.MICROSOFT_CLIENT_ID, token=request.session['oauth_token'])
    user_info = oauth.get(USER_INFO_URL).json()

    if 'id' in user_info:
        microsoft_id = user_info['id']
        email = user_info.get('mail') or user_info.get('userPrincipalName')
        first_name = user_info.get('givenName')
        last_name = user_info.get('surname')

        user, created = User.objects.get_or_create(
            microsoft_id=microsoft_id,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name
            }
        )

        if not created:
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.login = email.split('@')[0]
            user.school = get_school_from_email(email)
            user.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return JsonResponse({
            'refresh': str(refresh),
            'access': access_token,
            'user': LoginUserSerializer(user).data
        })

    return JsonResponse({'error': 'Failed to retrieve user info from Microsoft Graph'}, status=400)

class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @extend_schema(
        summary="List all users",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
