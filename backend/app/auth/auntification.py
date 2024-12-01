from datetime import (
    datetime,
    timedelta,
    timezone,
)
from typing import Optional, Union

from jose import JWTError, jwt

from app.settings import config
from app.user.dal import UserDAL
from app.user.models import UserModel

from .hash import Hasher


SECRET = config.app_jwt_secret


async def authenticate_user(
    email: str, password: str, user_dal: UserDAL
) -> Union[UserModel, None]:
    user = await user_dal.get_by_email(email=email)
    if user is None:
        return
    if not user.is_active:
        return
    if not Hasher.verify_password(password, user.hashed_password):
        return
    return user


def create_access_token(email: str, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = {"sub": email}
    if expires_delta is not None:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            seconds=config.app_cookie_age_seconds
        )
    to_encode["exp"] = expire
    encoded_jwt = jwt.encode(to_encode, SECRET, algorithm="HS256")
    return encoded_jwt


def verify_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise JWTError
        return payload
    except JWTError:
        return
