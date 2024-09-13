from typing import Literal, Optional
from fastapi import Response, status
from fastapi.security import APIKeyCookie
from app.openapi_responses import OpenAPIResponseType

COOKIE_MAX_AGE = 60 * 60 * 3
COOKIE_PATH = "/"
COOKIE_DOMAIN = "localhost"
COOKIE_NAME = "token"


class CookieTransport:
    cookie_name: str = COOKIE_NAME
    scheme: APIKeyCookie = APIKeyCookie(name=cookie_name, auto_error=False)
    cookie_max_age: Optional[int] = COOKIE_MAX_AGE,
    cookie_path: str = COOKIE_PATH,
    cookie_domain: Optional[str] = COOKIE_DOMAIN,
    cookie_secure: bool = True,
    cookie_httponly: bool = True,
    cookie_samesite: Literal["lax", "strict", "none"] = "strict",

    @classmethod
    async def get_login_response(cls, token: str) -> Response:
        response = Response(status_code=status.HTTP_204_NO_CONTENT)
        return cls._set_login_cookie(response, token)

    @classmethod
    async def get_logout_response(cls) -> Response:
        response = Response(status_code=status.HTTP_204_NO_CONTENT)
        return cls._set_logout_cookie(response)

    @classmethod
    def _set_login_cookie(cls, response: Response, token: str) -> Response:
        response.set_cookie(
            cls.cookie_name,
            token,
            max_age=cls.cookie_max_age,
            path=cls.cookie_path,
            domain=cls.cookie_domain,
            secure=cls.cookie_secure,
            httponly=cls.cookie_httponly,
            samesite=cls.cookie_samesite,
        )
        return response
    @classmethod
    def _set_logout_cookie(cls, response: Response) -> Response:
        response.set_cookie(
            cls.cookie_name,
            "",
            max_age=cls.cookie_max_age,
            path=cls.cookie_path,
            domain=cls.cookie_domain,
            secure=cls.cookie_secure,
            httponly=cls.cookie_httponly,
            samesite=cls.cookie_samesite,
        )
        return response

    @staticmethod
    def get_openapi_login_responses_success() -> OpenAPIResponseType:
        return {status.HTTP_204_NO_CONTENT: {"model": None}}

    @staticmethod
    def get_openapi_logout_responses_success() -> OpenAPIResponseType:
        return {status.HTTP_204_NO_CONTENT: {"model": None}}
