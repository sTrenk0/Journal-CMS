from fastapi import Cookie, HTTPException, status, Depends
from .errors import AuthError
from .transport import COOKIE_NAME
from app.user.models import UserModel
from app.user.dal import UserDAL
from .auntification import verify_access_token
from base64 import b64decode
from typing import Annotated


async def authorize_user(token: str, user_dal: UserDAL, superuser: bool = False) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=AuthError.UNAUTHORIZED,
    )

    forbidden_exception = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=AuthError.FORBIDDEN,
    )

    decoded_payload_from_token = verify_access_token(b64decode(token).decode("utf-8"))
    if decoded_payload_from_token is None:
        raise credentials_exception

    user = await user_dal.get_by_email(decoded_payload_from_token.get("sub"))
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise forbidden_exception

    if superuser:
        if not user.is_superuser:
            raise forbidden_exception

    return user


async def get_current_active_user(
        token: Annotated[str, Cookie(alias=COOKIE_NAME)],
        user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)]
) -> UserModel:
    """
    Get current active user.
    :param token: token from cookies
    :param user_dal: UserDAL

    :return: User model
    :raise: HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
    """
    return await authorize_user(token, user_dal, superuser=False)


async def get_current_active_superuser(
        token: Annotated[str, Cookie(alias=COOKIE_NAME)],
        user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)]
) -> UserModel:
    """
    Get current active superuser.
    :param token: token from cookies
    :param user_dal: UserDAL

    :return: User model
    :raise: HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
    """
    return await authorize_user(token, user_dal, superuser=True)
