from typing import Any, Dict
from allauth.headless.tokens.sessions import SessionTokenStrategy
from django.http import HttpRequest
from rest_framework.authtoken.models import Token
from allauth.headless.adapter import DefaultHeadlessAdapter
from allauth.account.adapter import DefaultAccountAdapter

from ask_gov.serializers import AuthUserSerializer


class AuthTokenStrategy(SessionTokenStrategy):
    def create_access_token(self, request: HttpRequest) -> str | None:
        access_token, created = Token.objects.get_or_create(user=request.user)
        return access_token.key

class HeadlessAdapter(DefaultHeadlessAdapter):
    def serialize_user(self, user) -> Dict[str, Any]:
        serializer = AuthUserSerializer(user)
        return serializer.data

class AccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        return False