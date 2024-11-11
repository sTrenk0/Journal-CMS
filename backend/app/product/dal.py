from typing import (
    Annotated,
    List,
    Union,
)
from uuid import UUID

from fastapi import Depends
from sqlalchemy import (
    and_,
    or_,
    select,
)
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.core import get_async_session

from .models import ProductModel


class ProductDAL:
    """Data Access Layer for operating procut info"""

    @staticmethod
    def get_as_dependency(
        db_session: Annotated[AsyncSession, Depends(get_async_session)],
    ) -> "ProductDAL":
        yield ProductDAL(db_session)

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create(
        self,
        source_product_url: str,
        name: str,
        description: str,
        preview_urls: list[str],
        is_active: bool = True,
    ) -> ProductModel:
        new_product = ProductModel(
            name=name,
            source_product_url=source_product_url,
            preview_urls=preview_urls,
            description=description,
            is_active=is_active,
        )
        self.db_session.add(new_product)
        await self.db_session.commit()
        await self.db_session.refresh(new_product)
        return new_product

    async def update(
        self, product: ProductModel, **kwargs
    ) -> Union[ProductModel, None]:
        if isinstance(product, ProductModel):
            for key, value in kwargs.items():
                setattr(product, key, value)
            await self.db_session.commit()
            await self.db_session.refresh(product)
            return product
        return None

    async def delete(self, product: ProductModel) -> Union[UUID, None]:
        if isinstance(product, ProductModel):
            await self.db_session.delete(product)
            await self.db_session.commit()
            return product.id
        return None

    async def get_by_id(
        self, product_id: UUID, only_is_active: bool = True
    ) -> Union[ProductModel, None]:
        try:
            statement = select(ProductModel).where(ProductModel.id == product_id)
            if only_is_active:
                statement = select(ProductModel).where(
                    and_(ProductModel.id == product_id, ProductModel.is_active == True)
                )
            result = await self.db_session.execute(statement)
            product = result.scalars().one()
            return product
        except NoResultFound:
            return None

    async def get_by_name(
        self, name: str, only_is_active: bool = True
    ) -> Union[ProductModel, None]:
        try:
            statement = select(ProductModel).where(ProductModel.name.ilike(f"%{name}%"))
            if only_is_active:
                statement = select(ProductModel).where(
                    and_(ProductModel.name == name, ProductModel.is_active == True)
                )
            result = await self.db_session.execute(statement)
            product = result.scalars().one()
            return product
        except NoResultFound:
            return None

    async def get_by_name_and_url(
        self, name: str, source_product_url: str
    ) -> Union[ProductModel, None]:
        """
        recommend use only in case before add new product as check if product already exists
        """
        try:
            result = await self.db_session.execute(
                select(ProductModel).where(
                    or_(
                        ProductModel.name == name,
                        ProductModel.source_product_url == source_product_url,
                    )
                )
            )
            product = result.scalars().one()
            return product
        except NoResultFound:
            return None

    async def get_all(
        self, only_is_active: bool = True
    ) -> Union[list[ProductModel], List]:
        try:
            statement = select(ProductModel)
            if only_is_active:
                statement = select(ProductModel).where(ProductModel.is_active == True)
            result = await self.db_session.execute(statement)
            products = result.scalars().all()
            return products
        except NoResultFound:
            return []
