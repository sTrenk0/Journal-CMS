from typing import (
    Annotated,
    List,
    Union,
)
from uuid import UUID

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.core import get_async_session
from .models import (
    CancelListModel,
    PaymentInfoModel,
    PaymentModel,
    TipsInfoModel,
    WalletDataModel,
)


class PaymentDAL:
    """Data Access Layer for payment operations"""

    @staticmethod
    def get_as_dependency(
        db_session: Annotated[AsyncSession, Depends(get_async_session)],
    ) -> "PaymentDAL":
        yield PaymentDAL(db_session)

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_all(self) -> Union[List["PaymentModel"], List]:
        try:
            statement = select(PaymentModel).options(
                selectinload(PaymentModel.product),
                selectinload(PaymentModel.cancelList),
                selectinload(PaymentModel.walletData),
                selectinload(PaymentModel.tipsInfo),
                selectinload(PaymentModel.paymentInfo),
            )
            result = await self.db_session.execute(statement)
            payments = result.scalars().all()
            return payments
        except NoResultFound:
            return []

    async def get_by_invoice(self, invoice: str) -> Union["PaymentModel", None]:
        try:
            result = await self.db_session.execute(
                select(PaymentModel)
                .where(PaymentModel.invoice == invoice)
                .options(
                    selectinload(PaymentModel.product),
                    selectinload(PaymentModel.cancelList),
                    selectinload(PaymentModel.walletData),
                    selectinload(PaymentModel.tipsInfo),
                    selectinload(PaymentModel.paymentInfo),
                )
            )
            payment = result.scalars().one()
            return payment
        except NoResultFound:
            return None

    async def create(
        self,
        payment: dict,
    ) -> "PaymentModel":
        """Depends on Product and Invoice"""
        new_payment = PaymentModel(
            **payment,
        )
        self.db_session.add(new_payment)
        await self.db_session.commit()
        await self.db_session.refresh(new_payment)
        return new_payment


class CancelListDal:
    @staticmethod
    def get_as_dependency(
        db_session: Annotated[AsyncSession, Depends(get_async_session)],
    ) -> "CancelListDal":
        yield CancelListDal(db_session)

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create(self, payment_id: UUID, cancel_list: dict) -> CancelListModel:
        new_cancel_list = CancelListModel(
            payment_id=payment_id,
            **cancel_list,
        )
        self.db_session.add(new_cancel_list)
        await self.db_session.commit()
        await self.db_session.refresh(new_cancel_list)
        return new_cancel_list


class WalletDataDal:
    @staticmethod
    def get_as_dependency(
        db_session: Annotated[AsyncSession, Depends(get_async_session)],
    ) -> "WalletDataDal":
        yield WalletDataDal(db_session)

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create(self, payment_id: UUID, wallet_data: dict) -> WalletDataModel:
        new_wallet_data = WalletDataModel(
            payment_id=payment_id,
            **wallet_data,
        )
        self.db_session.add(new_wallet_data)
        await self.db_session.commit()
        await self.db_session.refresh(new_wallet_data)
        return new_wallet_data


class PaymentInfoDal:
    @staticmethod
    def get_as_dependency(
        db_session: Annotated[AsyncSession, Depends(get_async_session)],
    ) -> "PaymentInfoDal":
        yield PaymentInfoDal(db_session)

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create(self, payment_id: UUID, payment_info: dict) -> PaymentInfoModel:
        new_payment_info = PaymentInfoModel(
            payment_id=payment_id,
            **payment_info,
        )
        self.db_session.add(new_payment_info)
        await self.db_session.commit()
        await self.db_session.refresh(new_payment_info)
        return new_payment_info


class TipsInfoDal:
    @staticmethod
    def get_as_dependency(
        db_session: Annotated[AsyncSession, Depends(get_async_session)],
    ) -> "TipsInfoDal":
        yield TipsInfoDal(db_session)

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create(self, payment_id: UUID, tips_info: dict) -> TipsInfoModel:
        new_tips_info = TipsInfoModel(
            payment_id=payment_id,
            **tips_info,
        )
        self.db_session.add(new_tips_info)
        await self.db_session.commit()
        await self.db_session.refresh(new_tips_info)
        return new_tips_info
