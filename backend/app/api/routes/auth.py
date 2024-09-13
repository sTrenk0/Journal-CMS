from uuid import UUID

from fastapi import APIRouter, status, Depends, Form, HTTPException, Path
from pydantic import EmailStr

from app.auth.hash import Hasher
from app.openapi_responses import LOGIN_BAD_CREDENTIAL_RESPONSE, UNAUTHORIZED_RESPONSE, NOT_VERIFY_EMAIl_RESPONSE
from typing import Annotated
from app.auth.auntification import authenticate_user, create_access_token
from app.auth.transport import CookieTransport
from app.errors import ErrorCode
from app.auth.deps import get_current_active_user
from app.database.dal import UserDAL
from app.email_utils import generate_verify_by_code_email, send_email

from secrets import randbelow

auth_router = APIRouter()

STORAGE_ID_AND_RECOVERY_PASSWORD_CODE: dict[int, UUID] = {}


@auth_router.post(
    "/login", status_code=status.HTTP_204_NO_CONTENT,
    responses={
        **LOGIN_BAD_CREDENTIAL_RESPONSE, **CookieTransport.get_openapi_login_responses_success()
    }
)
async def login(
        email: Annotated[EmailStr, Form()],
        password: Annotated[str, Form()],
        transport: CookieTransport = Depends()
):
    user = await authenticate_user(email, password)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=ErrorCode.LOGIN_BAD_CREDENTIALS)

    token = create_access_token(user.email)
    response = transport.get_login_response(token)
    return response


@auth_router.post(
    "/logout", status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **UNAUTHORIZED_RESPONSE,
        **CookieTransport.get_openapi_logout_responses_success()
    }
)
async def logout(transport: CookieTransport = Depends()):
    response = transport.get_logout_response()
    return response


@auth_router.get("/forgot-password", status_code=status.HTTP_202_ACCEPTED, response_model=None)
async def request_forgot_password(email: Annotated[EmailStr, Path()], user_dal: UserDAL = Depends(UserDAL.get_as_dependency)):
    user = await user_dal.get_user_by_email(email)
    if user:
        code = randbelow(10000)
        global STORAGE_ID_AND_RECOVERY_PASSWORD_CODE
        STORAGE_ID_AND_RECOVERY_PASSWORD_CODE[code] = user.id
        verify_email_code_template = generate_verify_by_code_email(email, code)
        send_email(verify_email_code_template, email)
        return

    return


@auth_router.get("/recovery-password", status_code=status.HTTP_204_NO_CONTENT, responses=NOT_VERIFY_EMAIl_RESPONSE)
async def recovery_password(
        code: Annotated[int, Form()],
        new_password: Annotated[str, Form()],
        user_dal: UserDAL = Depends(UserDAL.get_as_dependency)) -> None:
    user_id = STORAGE_ID_AND_RECOVERY_PASSWORD_CODE.pop(code, None)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.NOT_VERIFY_EMAIl
        )

    await user_dal.update_user(user_id, hashed_password=Hasher.get_password_hash(new_password))
    return None
