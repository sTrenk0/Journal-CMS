from typing import Union, List, Annotated
from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from .models import UserModel
from app.database.core import get_async_session


class UserDAL:
    """Data Access Layer for operating user info"""

    @staticmethod
    def get_as_dependency(db_session: Annotated[AsyncSession, Depends(get_async_session)]) -> "UserDAL":
        yield UserDAL(db_session)

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create(
            self,
            email: str,
            hashed_password: str,
            is_active=True,
            is_superuser=False,
    ) -> UserModel:
        new_user = UserModel(
            email=email,
            hashed_password=hashed_password,
            is_active=is_active,
            is_superuser=is_superuser,
        )
        self.db_session.add(new_user)
        await self.db_session.commit()
        await self.db_session.refresh(new_user)
        return new_user

    async def delete(self, user: UserModel) -> Union[UUID, None]:
        if isinstance(user, UserModel):
            await self.db_session.delete(user)
            await self.db_session.commit()
            return user.id
        return None

    async def get_by_id(self, user_id: UUID) -> Union[UserModel, None]:
        try:
            result = await self.db_session.execute(
                select(UserModel).where(UserModel.id == user_id)
            )
            user = result.scalars().one()
            return user
        except NoResultFound:
            return None

    async def get_by_email(self, email: str) -> Union[UserModel, None]:
        try:
            result = await self.db_session.execute(
                select(UserModel).where(UserModel.email == email)
            )
            user = result.scalars().one()
            return user
        except NoResultFound:
            return None

    async def update(self, user: UserModel, **kwargs) -> Union[UserModel, None]:
        if isinstance(user, UserModel):
            for key, value in kwargs.items():
                setattr(user, key, value)
            await self.db_session.commit()
            await self.db_session.refresh(user)
            return user
        return None

    async def get_all(self) -> Union[list[UserModel], List]:
        try:
            result = await self.db_session.execute(select(UserModel))
            users = result.scalars().all()
            return users
        except NoResultFound:
            return []
