import pytest
from app.test.conftest import test_user_source_password, test_user_data
from app.auth.transport import CookieTransport
from fastapi import status
from app.test.conftest import test_user_source_password, test_user_data


async def test_successful_login(app_client, created_example_user):
    response = app_client.post(
        "/api/auth/login", data={
            "email": test_user_data["email"], "password": test_user_source_password
        }
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.cookies == {
        "key": CookieTransport.cookie_name,
        "value": response.cookies.get("value"),
        "max_age": CookieTransport.cookie_max_age,
        "path": CookieTransport.cookie_path,
        "domain": CookieTransport.cookie_domain,
        "secure": CookieTransport.cookie_secure,
        "httponly": CookieTransport.cookie_httponly,
        "samesite": CookieTransport.cookie_samesite
    }
    assert response.json() == {}


# async def test_unsuccessful_login(app_client, created_example_user):
#     pass


async def test_successful_logout(app_client, created_example_user):
    login_response = app_client.post(
        "/api/auth/login", data={
            "email": test_user_data["email"], "password": test_user_source_password
        }
    )
    response = app_client.post(
        "/api/auth/login", cookies={
            **login_response.cookies
        }
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.cookies == {
        "key": CookieTransport.cookie_name,
        "value": "",
        "max_age": CookieTransport.cookie_max_age,
        "path": CookieTransport.cookie_path,
        "domain": CookieTransport.cookie_domain,
        "secure": CookieTransport.cookie_secure,
        "httponly": CookieTransport.cookie_httponly,
        "samesite": CookieTransport.cookie_samesite
    }
    assert response.json() == {}


async def test_successful_login(app_client, created_example_user):
    response = app_client.post(
        "/api/auth/login", data={
            "email": test_user_data["email"], "password": test_user_source_password
        }
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.cookies == {
        "key": CookieTransport.cookie_name,
        "value": response.cookies.get("value"),
        "max_age": CookieTransport.cookie_max_age,
        "path": CookieTransport.cookie_path,
        "domain": CookieTransport.cookie_domain,
        "secure": CookieTransport.cookie_secure,
        "httponly": CookieTransport.cookie_httponly,
        "samesite": CookieTransport.cookie_samesite
    }
    assert response.json() == {}


# async def test_unsuccessful_login(app_client, created_example_user):
#     pass


async def test_successful_logout(app_client, created_example_user):
    login_response = app_client.post(
        "/api/auth/login", data={
            "email": test_user_data["email"], "password": test_user_source_password
        }
    )
    response = app_client.post(
        "/api/auth/login", cookies={
            **login_response.cookies
        }
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.cookies == {
        "key": CookieTransport.cookie_name,
        "value": "",
        "max_age": CookieTransport.cookie_max_age,
        "path": CookieTransport.cookie_path,
        "domain": CookieTransport.cookie_domain,
        "secure": CookieTransport.cookie_secure,
        "httponly": CookieTransport.cookie_httponly,
        "samesite": CookieTransport.cookie_samesite
    }
    assert response.json() == {}
