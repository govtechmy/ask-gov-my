from allauth.headless.tokens.sessions import SessionTokenStrategy
from django.http import HttpRequest
from rest_framework.authtoken.models import Token


class AuthTokenStrategy(SessionTokenStrategy):
    def create_access_token(self, request: HttpRequest) -> str | None:
        access_token, created = Token.objects.get_or_create(user=request.user)
        return access_token.key
