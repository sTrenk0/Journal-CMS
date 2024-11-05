import random
from pydantic import EmailStr
from typing import Annotated, TypeVar
from fastapi import (
    APIRouter,
    status,
    Depends,
    Form,
    HTTPException,
    Query,
    BackgroundTasks,
)

from app.auth.openapi_responses import (
    LOGIN_BAD_CREDENTIAL_RESPONSE,
    UNAUTHORIZED_RESPONSE,
    NOT_VERIFY_EMAIl_RESPONSE,
)
from app.email_utils import generate_recovery_password_email_template, send_email
from app.auth.auntification import authenticate_user, create_access_token
from app.auth.hash import Hasher
from app.auth.transport import CookieTransport
from app.auth.errors import AuthError
from app.auth.deps import get_current_active_user
from app.user.dal import UserDAL

T_USER_EMAIL = TypeVar("T_USER_EMAIL", bound=str)
T_CODE = TypeVar("T_CODE", bound=int)
STORAGE_EMAIL_AND_RECOVERY_PASSWORD_CODE: dict[T_USER_EMAIL, dict[str, T_CODE]] = {}

auth_router = APIRouter()


@auth_router.post(
    "/login",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        **LOGIN_BAD_CREDENTIAL_RESPONSE,
        **CookieTransport.get_openapi_login_responses_success(),
    },
)
async def login(
    email: Annotated[EmailStr, Form()],
    password: Annotated[str, Form()],
    transport: Annotated[CookieTransport, Depends()],
    user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)],
):
    user = await authenticate_user(email, password, user_dal=user_dal)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=AuthError.LOGIN_BAD_CREDENTIALS,
        )

    token = create_access_token(user.email)
    response = transport.get_login_response(token)
    return response


@auth_router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **UNAUTHORIZED_RESPONSE,
        **CookieTransport.get_openapi_logout_responses_success(),
    },
)
async def logout(transport: Annotated[CookieTransport, Depends()]):
    response = transport.get_logout_response()
    return response


@auth_router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
async def request_forgot_password(
    email: Annotated[EmailStr, Query()],
    background_tasks: BackgroundTasks,
    user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)],
):
    user = await user_dal.get_by_email(email)
    if user:
        recovery_code = random.randint(1000, 9999)
        global STORAGE_EMAIL_AND_RECOVERY_PASSWORD_CODE
        STORAGE_EMAIL_AND_RECOVERY_PASSWORD_CODE[email] = {
            "recovery_code": recovery_code,
        }
        verify_email_code_template = generate_recovery_password_email_template(
            email_to=email, recovery_code=recovery_code
        )
        background_tasks.add_task(
            send_email, msg=verify_email_code_template, email_to=email
        )
        return

    return


@auth_router.post(
    "/recovery-password",
    status_code=status.HTTP_204_NO_CONTENT,
    responses=NOT_VERIFY_EMAIl_RESPONSE,
)
async def recovery_password(
    email: Annotated[EmailStr, Form()],
    recovery_code: Annotated[int, Form()],
    new_password: Annotated[str, Form()],
    user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)],
) -> None:
    saved_data_for_recovery = STORAGE_EMAIL_AND_RECOVERY_PASSWORD_CODE.pop(email, None)
    if (
        saved_data_for_recovery is None
        or saved_data_for_recovery["recovery_code"] != recovery_code
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=AuthError.NOT_VERIFY_EMAIl
        )

    user = await user_dal.get_by_email(email)
    await user_dal.update(
        user,
        hashed_password=Hasher.get_password_hash(new_password),
    )
    return