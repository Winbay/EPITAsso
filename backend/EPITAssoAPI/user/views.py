from django.conf import settings
from django.http import JsonResponse
from drf_spectacular.utils import extend_schema, OpenApiParameter, inline_serializer
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, DetailUserSerializer
from requests_oauthlib import OAuth2Session
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from user.utils import get_school_from_email

AUTH_BASE_URL = f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize"
TOKEN_URL = f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID}/oauth2/v2.0/token"
USER_INFO_URL = "https://graph.microsoft.com/v1.0/me"


class MicrosoftLoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Microsoft authentication",
        parameters=[
            OpenApiParameter(
                name="redirect_uri", description="redirect URI", required=True, type=str
            )
        ],
        responses={
            (302, "application/json"): inline_serializer(
                name="RedirectResponse",
                fields={"redirect": serializers.CharField(help_text="Redirect URL")},
            ),
            (400, "application/json"): inline_serializer(
                name="LoginErrorResponse",
                fields={"error": serializers.CharField(help_text="Error message")},
            ),
        },
    )
    def get(self, request):
        redirect_uri = request.GET.get("redirect_uri")
        if not redirect_uri:
            return JsonResponse({"error": "Missing redirect_uri"}, status=400)

        oauth = OAuth2Session(
            settings.MICROSOFT_CLIENT_ID,
            redirect_uri=redirect_uri,
            scope=settings.MICROSOFT_SCOPES,
        )
        authorization_url, _ = oauth.authorization_url(AUTH_BASE_URL)
        return redirect(authorization_url)


class MicrosoftTokenView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="Microsoft token retrieval",
        request=inline_serializer(
            name="TokenRequest",
            fields={
                "code": serializers.CharField(help_text="Authorization code"),
                "redirect_uri": serializers.CharField(help_text="Redirect URI"),
            },
        ),
        responses={
            (200, "application/json"): inline_serializer(
                name="TokenResponse",
                fields={
                    "token_type": serializers.CharField(help_text="Type of token"),
                    "access_token": serializers.CharField(help_text="Access token"),
                    "refresh_token": serializers.CharField(help_text="Refresh token"),
                    "expires_in": serializers.IntegerField(
                        help_text="Token lifetime in seconds"
                    ),
                },
            ),
            (400, "application/json"): inline_serializer(
                name="TokenErrorResponse",
                fields={"error": serializers.CharField(help_text="Error message")},
            ),
        },
    )
    def post(self, request):
        code = request.data.get("code")

        if not code:
            return JsonResponse({"error": "Authorization code is required"}, status=400)

        oauth = OAuth2Session(
            settings.MICROSOFT_CLIENT_ID,
            redirect_uri=request.POST.get("redirect_uri"),
        )
        try:
            token = oauth.fetch_token(
                TOKEN_URL,
                code=code,
                client_secret=settings.MICROSOFT_CLIENT_SECRET,
            )
        except Exception:
            return JsonResponse(
                {"error": "Failed to fetch token from Microsoft"}, status=400
            )

        oauth = OAuth2Session(settings.MICROSOFT_CLIENT_ID, token=token)
        user_info = oauth.get(USER_INFO_URL).json()

        if "id" in user_info:
            microsoft_id = user_info["id"]
            email = user_info.get("mail") or user_info.get("userPrincipalName")
            first_name = user_info.get("givenName")
            last_name = user_info.get("surname")
            username = user_info.get("displayName")
            login = email.split("@")[0]

            try:
                user = User.objects.get(login=login)
            except User.DoesNotExist:
                user = None

            if user:
                user.microsoft_id = microsoft_id
                user.username = username
                user.email = email
                user.first_name = first_name
                user.last_name = last_name
                user.school = get_school_from_email(email)
                user.save()
            else:
                user = User.objects.create_user(
                    login=login,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    school=get_school_from_email(email),
                    username=username,
                )
                user.save()

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return JsonResponse(
                {
                    "token_type": "Bearer",
                    "access_token": access_token,
                    "refresh_token": str(refresh),
                    "expires_in": refresh.access_token.lifetime.total_seconds(),
                }
            )

        return JsonResponse(
            {"error": "Failed to retrieve user info from Microsoft Graph"}, status=400
        )


class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @extend_schema(
        summary="List all users",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = DetailUserSerializer

    @extend_schema(
        summary="Retrieve a user",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class UserLoggedDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = DetailUserSerializer

    @extend_schema(
        summary="Retrieve the logged user",
    )
    def get(self, request, *args, **kwargs):
        self.kwargs["pk"] = request.user.id
        return super().get(request, *args, **kwargs)
