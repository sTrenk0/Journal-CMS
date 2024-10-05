import datetime
import time
from http.cookies import SimpleCookie

import pytest

from app.errors import ErrorCode
from app.auth.transport import CookieTransport
from fastapi import status
from app.test.conftest import test_user_source_password, test_user_data
from app.api.routes.auth import STORAGE_ID_AND_RECOVERY_PASSWORD_CODE

EMAIL_VALIDATION_ERROR = {
    "detail": [
        {
            "type": "value_error",
            "loc": [
                "body",
                "email"
            ],
            "msg": "value is not a valid email address: An email address must have an @-sign.",
            "input": "",
            "ctx": {
                "reason": "An email address must have an @-sign."
            }
        }
    ]
}


def test_successful_login(app_client):
    response = app_client.post(
        "/api/auth/login", data={
            "email": test_user_data["email"], "password": test_user_source_password
        }
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT
    set_cookie_header = response.headers.get("set-cookie")
    assert set_cookie_header is not None
    cookie = SimpleCookie(set_cookie_header)
    token_cookie = cookie.get("token")
    assert token_cookie is not None
    assert str(token_cookie["domain"]) == str(CookieTransport.cookie_domain)
    assert str(token_cookie["httponly"]) == "True"
    assert str(token_cookie["max-age"]) == "10800"
    assert str(token_cookie["path"]) == "/"
    assert str(token_cookie["samesite"]) == "strict"
    assert str(token_cookie["secure"]) == "True"
    assert response.content == b""


email_validation_error_with_value_incorrect_email = EMAIL_VALIDATION_ERROR.copy()
email_validation_error_with_value_incorrect_email["detail"][0]["input"] = "incorrect_email"


@pytest.mark.parametrize(
    "email, password, status_code_response, detail", [
        (
                test_user_data["email"], "incorrect_password", status.HTTP_400_BAD_REQUEST,
                ErrorCode.LOGIN_BAD_CREDENTIALS
        ),
        (
                "incorrect_email", test_user_source_password, status.HTTP_422_UNPROCESSABLE_ENTITY,
                email_validation_error_with_value_incorrect_email["detail"]
        ),
        (
                "incorrect_email@gmail.com", "incorrect_password", status.HTTP_400_BAD_REQUEST,
                ErrorCode.LOGIN_BAD_CREDENTIALS
        )
    ]
)
def test_unsuccessful_login_with_bad_credentials(app_client, email, password, status_code_response, detail):
    response = app_client.post(
        "/api/auth/login", data={
            "email": email, "password": password
        }
    )
    assert response.status_code == status_code_response
    assert response.json()["detail"] == detail
    assert response.cookies == {}


def test_unsuccessful_logout_with_incorrect_cookie_name(app_client):
    missing_cookie_response = {
        "detail": [
            {
                "type": "missing",
                "loc": [
                    "cookie",
                    "token"
                ],
                "msg": "Field required",
                "input": None
            }
        ]
    }
    response = app_client.post(
        "/api/auth/logout",
        cookies={
            "incorrect_cookie_name": "some_token"
        }
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"] == missing_cookie_response["detail"]
    assert response.cookies == {}


def test_unsuccessful_logout_with_expired_cookie(app_client, create_test_cookie):
    t = datetime.timedelta(seconds=0)
    token_value = create_test_cookie(test_user_data["email"], expires_delta=t)
    time.sleep(1)
    response = app_client.post(
        "/api/auth/logout",
        cookies={
            "token": token_value
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == ErrorCode.UNAUTHORIZED
    assert response.cookies == {}


def test_successful_logout(app_client, create_test_cookie):
    token_value = create_test_cookie(test_user_data["email"])
    response = app_client.post(
        "/api/auth/logout", cookies={
            "token": token_value
        }
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT
    set_cookie_header = response.headers.get("set-cookie")
    assert set_cookie_header is not None
    cookie = SimpleCookie(set_cookie_header)
    token_cookie = cookie.get("token")
    assert token_cookie is not None
    assert token_cookie.value == ""
    assert token_cookie["expires"] == ""
    assert str(token_cookie["domain"]) == str(CookieTransport.cookie_domain)
    assert str(token_cookie["httponly"]) == "True"
    assert str(token_cookie["max-age"]) == "10800"
    assert str(token_cookie["path"]) == "/"
    assert str(token_cookie["samesite"]) == "strict"
    assert str(token_cookie["secure"]) == "True"
    assert response.content == b""


@pytest.mark.email_test
def test_successful_forgot_password(app_client, get_user_by_email):
    user_id = get_user_by_email(test_user_data["email"]).id
    response = app_client.post(
        "/api/auth/forgot-password",
        params={"email": test_user_data["email"]}
    )
    assert response.status_code == status.HTTP_202_ACCEPTED
    assert user_id in [v for v in STORAGE_ID_AND_RECOVERY_PASSWORD_CODE.values()]
    assert response.content == b"null"



