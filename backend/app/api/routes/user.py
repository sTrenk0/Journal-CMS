from typing import Annotated, List
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from app.auth.deps import get_current_active_superuser, get_current_active_user
from app.auth.errors import AuthError
from app.auth.hash import Hasher
from app.auth.openapi_responses import FORBIDDEN_RESPONSE, UNAUTHORIZED_RESPONSE
from app.settings import config
from app.user.dal import UserDAL
from app.user.errors import UserError
from app.user.models import UserModel
from app.user.openapi_responses import (
    USER_ALREADY_EXISTS_RESPONSE,
    USER_NOT_FOUND_RESPONSE,
    USER_WITH_THIS_EMAIL_ALREADY_EXISTS_RESPONSE,
)
from app.user.schemas import (
    CreateUser,
    UpdateUser,
    UserResponse,
)

user_router = APIRouter()


@user_router.post(
    "/",
    response_model=UserResponse,
    responses={
        **USER_ALREADY_EXISTS_RESPONSE,
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE,
    },
    dependencies=[Depends(get_current_active_superuser)],
    status_code=status.HTTP_201_CREATED,
)
async def add_user(
    body: CreateUser, user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)]
):
    """
    Available for superuser
    """
    create_user_data = body.create_update_dict()
    user = await user_dal.get_by_email(email=body.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=UserError.ALREADY_EXISTS
        )

    hashed_password = Hasher.get_password_hash(create_user_data.pop("password"))
    create_user_data["hashed_password"] = hashed_password
    created_user = await user_dal.create(**create_user_data)
    return created_user


@user_router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_active_superuser)],
    responses={
        **USER_NOT_FOUND_RESPONSE,
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE,
    },
)
async def delete_user(
    user_id: UUID, user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)]
):
    """
    Available for superuser
    """
    user = await user_dal.get_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=UserError.NOT_FOUND
        )
    if user.email == config.app_initial_superuser_email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=AuthError.FORBIDDEN
        )
    await user_dal.delete(user)


@user_router.get(
    "/me", response_model=UserResponse, responses={**UNAUTHORIZED_RESPONSE}
)
async def get_me(user: Annotated[UserModel, Depends(get_current_active_user)]):
    """
    Available for active users and superuser
    """
    return user


@user_router.get(
    "/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(get_current_active_superuser)],
    responses={
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE,
        **USER_NOT_FOUND_RESPONSE,
    },
)
async def get_user(
    user_id: UUID, user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)]
):
    """
    Available for superuser
    """
    user = await user_dal.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=UserError.NOT_FOUND
        )
    return user


@user_router.get(
    "/",
    response_model=List[UserResponse],
    dependencies=[Depends(get_current_active_superuser)],
    responses={**FORBIDDEN_RESPONSE, **UNAUTHORIZED_RESPONSE},
)
async def get_users(user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)]):
    """
    available for superuser
    """
    users = await user_dal.get_all()
    return users


@user_router.patch(
    "/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(get_current_active_superuser)],
    responses={
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE,
        **USER_NOT_FOUND_RESPONSE,
        **USER_WITH_THIS_EMAIL_ALREADY_EXISTS_RESPONSE,
    },
)
async def update_user(
    body: UpdateUser,
    user_id: UUID,
    user_dal: Annotated[UserDAL, Depends(UserDAL.get_as_dependency)],
):
    """
    available for superuser
    """
    user = await user_dal.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=UserError.NOT_FOUND
        )

    if user.email == config.app_initial_superuser_email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=AuthError.FORBIDDEN
        )

    if body.email is not None and user.email != body.email:
        user = await user_dal.get_by_email(body.email)
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=UserError.EMAIL_ALREADY_EXISTS,
            )

    kwargs = {}
    if body.password:
        kwargs["hashed_password"] = Hasher.get_password_hash(body.password)
    data_to_update = body.create_update_dict()
    data_to_update.update(kwargs)
    return await user_dal.update(user_id=user_id, **data_to_update)
