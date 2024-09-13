from datetime import timedelta, datetime, timezone
from typing import Union, Optional

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.auth.hash import Hasher
from backend.app.database.dal import UserDAL
from backend.app.database.models import User
from .transport import COOKIE_MAX_AGE
from secrets import token_urlsafe
from jose import jwt, JWTError

SECRET = token_urlsafe(32)


async def authenticate_user(
        email: str, password: str, user_dal: UserDAL = Depends(UserDAL.get_as_dependency)
) -> Union[User, None]:
    user = await user_dal.get_user_by_email(email=email)
    if user is None:
        return
    if not user.is_active:
        return
    if not Hasher.verify_password(password, user.hashed_password):
        return
    return user


def create_access_token(email: str, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = {"sub": email}
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(seconds=COOKIE_MAX_AGE)
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
