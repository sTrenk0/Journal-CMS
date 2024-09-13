from fastapi import Cookie, HTTPException, status, Depends
from app.errors import ErrorCode
from .transport import COOKIE_NAME
from app.database.models import User
from app.database.dal import UserDAL
from .auntification import verify_access_token


async def get_current_active_user(
        token: str = Cookie(alias=COOKIE_NAME),
        user_dal: UserDAL = Depends(UserDAL.get_as_dependency)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=ErrorCode.UNAUTHORIZED,
    )

    decoded_payload_from_token = verify_access_token(token)
    if decoded_payload_from_token is None:
        raise credentials_exception

    user = await user_dal.get_user_by_email(decoded_payload_from_token.get("sub"))
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=ErrorCode.FORBIDDEN,
        )

    return user


async def get_current_active_superuser(current_user: User = Depends(get_current_active_user)):
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=ErrorCode.FORBIDDEN,
        )
