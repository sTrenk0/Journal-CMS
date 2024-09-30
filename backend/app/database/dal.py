from typing import Union, List, Any, Type
from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import User
from app.database.core import get_async_session

from typing_extensions import Self

class UserDAL:
    """Data Access Layer for operating user info"""

    @staticmethod
    def get_as_dependency(db_session: AsyncSession = Depends(get_async_session)) -> Self:
        yield UserDAL(db_session)

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_user(
            self,
            email: str,
            hashed_password: str,
            is_active=True,
            is_superuser=False,
    ) -> User:
        new_user = User(
            email=email,
            hashed_password=hashed_password,
            is_active=is_active,
            is_superuser=is_superuser,
        )
        self.db_session.add(new_user)
        await self.db_session.commit()
        await self.db_session.refresh(new_user)
        return new_user

    async def delete_user(self, user_id: UUID) -> Union[UUID, None]:
        user = await self.get_user_by_id(user_id)
        if user is not None and user.is_active:
            user_id = user.user_id
            del user
            await self.db_session.commit()
            return user_id
        return None

    async def get_user_by_id(self, user_id: UUID) -> Union[User, None]:
        try:
            result = await self.db_session.execute(
                select(User).where(User.user_id == user_id)
            )
            user = result.scalars().one()
            return user
        except NoResultFound:
            return None

    async def get_user_by_email(self, email: str) -> Union[User, None]:
        try:
            result = await self.db_session.execute(
                select(User).where(User.email == email)
            )
            user = result.scalars().one()
            return user
        except NoResultFound:
            return None

    async def update_user(self, user_id: UUID, **kwargs) -> Union[UUID, None]:
        user = await self.get_user_by_id(user_id)
        if user and user.is_active:
            for key, value in kwargs.items():
                setattr(user, key, value)
            await self.db_session.commit()
            return user.user_id
        return None

    async def get_all_users(self) -> List[User]:
        result = await self.db_session.execute(select(User))
        users = result.scalars().all()
        return list[users]
