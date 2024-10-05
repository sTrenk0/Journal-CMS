from typing import Union, List
from uuid import UUID

from fastapi import Depends
from sqlalchemy import select, and_, or_
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from .models import User, Product
from .core import get_async_session


class UserDAL:
    """Data Access Layer for operating user info"""

    @staticmethod
    def get_as_dependency(db_session: AsyncSession = Depends(get_async_session)) -> "UserDAL":
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
        if user is not None:
            await self.db_session.delete(user)
            await self.db_session.commit()
            return user_id
        return None

    async def get_user_by_id(self, user_id: UUID) -> Union[User, None]:
        try:
            result = await self.db_session.execute(
                select(User).where(User.id == user_id)
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
        if user:
            for key, value in kwargs.items():
                setattr(user, key, value)
            await self.db_session.commit()
            await self.db_session.refresh(user)
            return user
        return None

    async def get_all_users(self) -> Union[list[User], List]:
        try:
            result = await self.db_session.execute(select(User))
            users = result.scalars().all()
            return users
        except NoResultFound:
            return []


class ProductDAL:
    """Data Access Layer for operating procut info"""

    @staticmethod
    def get_as_dependency(db_session: AsyncSession = Depends(get_async_session)) -> "ProductDAL":
        yield ProductDAL(db_session)

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_product(
            self,
            source_product_url: str,
            name: str,
            description: str, price: float,
            preview_urls: list[str],
            is_active: bool = True
    ) -> Product:
        new_product = Product(
            name=name,
            source_product_url=source_product_url,
            preview_urls=preview_urls,
            description=description,
            price=price,
            is_active=is_active,
        )
        self.db_session.add(new_product)
        await self.db_session.commit()
        await self.db_session.refresh(new_product)
        return new_product

    async def update_product(self, product: Product, **kwargs) -> Union[Product, None]:
        if isinstance(product, Product):
            for key, value in kwargs.items():
                setattr(product, key, value)
            await self.db_session.commit()
            await self.db_session.refresh(product)
            return product
        return None

    async def delete_product(self, product: Product) -> Union[UUID, None]:
        if isinstance(product, Product):
            await self.db_session.delete(product)
            await self.db_session.commit()
            return product.id
        return None

    async def get_product_by_id(self, product_id: UUID, only_is_active: bool = True) -> Union[Product, None]:
        try:
            statement = select(Product).where(Product.id == product_id)
            if only_is_active:
                statement = select(Product).where(and_(Product.id == product_id, Product.is_active == True))
            result = await self.db_session.execute(statement)
            product = result.scalars().one()
            return product
        except NoResultFound:
            return None

    async def get_product_by_name(self, name: str, only_is_active: bool = True) -> Union[Product, None]:
        try:
            statement = select(Product).where(Product.name.ilike(f"%{name}%"))
            if only_is_active:
                statement = select(Product).where(and_(Product.name == name, Product.is_active == True))
            result = await self.db_session.execute(statement)
            product = result.scalars().one()
            return product
        except NoResultFound:
            return None

    async def get_product_by_url(self, source_product_url: str, only_is_active: bool = True) -> Union[Product, None]:
        try:
            statement = select(Product).where(Product.url.ilike(f"%{url}%"))
            if only_is_active:
                statement = select(Product).where(and_(Product.source_product_url == source_product_url, Product.is_active == True))
            result = await self.db_session.execute(statement)
            product = result.scalars().one()
            return product
        except NoResultFound:
            return None

    async def get_product_by_name_and_url(self, name: str, source_product_url: str) -> Union[Product, None]:
        """
        recommend use only in case before add new product as check if product already exists
        """
        try:
            result = await self.db_session.execute(
                select(Product).where(or_(Product.name == name, Product.source_product_url == source_product_url))
            )
            product = result.scalars().one()
            return product
        except NoResultFound:
            return None

    async def get_all_products(self, only_is_active: bool = True) -> Union[list[Product], List]:
        try:
            statement = select(Product)
            if only_is_active:
                statement = select(Product).where(Product.is_active == True)
            result = await self.db_session.execute(statement)
            products = result.scalars().all()
            return products
        except NoResultFound:
            return []
