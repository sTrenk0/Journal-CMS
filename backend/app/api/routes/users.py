from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

from backend.app.database.models import User
from backend.app.auth.deps import get_current_active_user, get_current_active_superuser
from backend.app.schemas import ResponseUser, CreateUser, UpdateUser
from backend.app.database.dal import UserDAL
from backend.app.auth.hash import Hasher
from backend.app.errors import ErrorCode
from backend.app.openapi_responses import (
    REGISTER_USER_ALREADY_EXISTS_RESPONSE,
    FORBIDDEN_RESPONSE,
    USER_NOT_FOUND_RESPONSE,
    UNAUTHORIZED_RESPONSE,
)

user_router = APIRouter()


@user_router.post(
    "/", response_model=ResponseUser, responses=REGISTER_USER_ALREADY_EXISTS_RESPONSE,
    status_code=status.HTTP_201_CREATED
)
async def register(
        body: CreateUser,
        user_dal: UserDAL = Depends(UserDAL.get_as_dependency)
):
    create_user_data = body.create_update_dict(safe=True)
    user = await user_dal.get_user_by_email(email=body.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.REGISTER_USER_ALREADY_EXISTS
        )

    hashed_password = Hasher.get_password_hash(create_user_data.pop("password"))
    create_user_data["hashed_password"] = hashed_password
    created_user = await user_dal.create_user(**create_user_data)
    return created_user


@user_router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_active_superuser)],
    responses={
        **USER_NOT_FOUND_RESPONSE, **FORBIDDEN_RESPONSE, **UNAUTHORIZED_RESPONSE
    }
)
async def delete_user(user_id: UUID, user_dal: UserDAL = Depends(UserDAL.get_as_dependency)):
    user = await user_dal.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorCode.USER_NOT_FOUND
        )

    await user_dal.delete_user(user_id)
    return


@user_router.get(
    "/{user_id}", response_model=ResponseUser,
    dependencies=[Depends(get_current_active_superuser)], responses={
        **FORBIDDEN_RESPONSE, **UNAUTHORIZED_RESPONSE, **USER_NOT_FOUND_RESPONSE
    }
)
async def get_user(user_id: UUID, user_dal: UserDAL = Depends(UserDAL.get_as_dependency)):
    user = await user_dal.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorCode.USER_NOT_FOUND
        )
    return user


@user_router.get(
    "/me", response_model=ResponseUser, responses={
        **UNAUTHORIZED_RESPONSE
    },
)
async def get_me(user: User = Depends(get_current_active_user)):
    return user


@user_router.get(
    "/", response_model=list[ResponseUser],
    dependencies=[Depends(get_current_active_superuser)],
    responses={
        **FORBIDDEN_RESPONSE, **UNAUTHORIZED_RESPONSE
    }
)
async def get_users(user_dal: UserDAL = Depends(UserDAL.get_as_dependency)):
    return await user_dal.get_all_users()


@user_router.patch(
    "/{user_id}", response_model=ResponseUser,
    dependencies=[Depends(get_current_active_superuser)],
    responses={
        **FORBIDDEN_RESPONSE, **UNAUTHORIZED_RESPONSE, **USER_NOT_FOUND_RESPONSE
    },
)
async def update_user(body: UpdateUser, user_id: UUID, user_dal: UserDAL = Depends(UserDAL.get_as_dependency)):
    user = await user_dal.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=ErrorCode.USER_NOT_FOUND
        )
    kwargs = {}
    if body.password:
        kwargs["hashed_password"] = Hasher.get_password_hash(body.password)
    data_to_update = body.create_update_dict(safe=False).update(kwargs)
    return await user_dal.update_user(user_id=user_id, **data_to_update)


@user_router.patch(
    "/me", response_model=ResponseUser,
    responses={
        **UNAUTHORIZED_RESPONSE
    },

)
async def update_me(
        body: UpdateUser,
        current_user: User = Depends(get_current_active_user),
        user_dal: UserDAL = Depends(UserDAL.get_as_dependency),
):
    kwargs = {}
    if body.password:
        kwargs["hashed_password"] = Hasher.get_password_hash(body.password)

    data_to_update = body.create_update_dict(safe=True).update(kwargs)
    return await user_dal.update_user(user_id=current_user.user_id, **data_to_update)
