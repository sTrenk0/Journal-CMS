from datetime import datetime
from datetime import timezone
from typing import TYPE_CHECKING, Optional, List
from uuid import UUID

from sqlalchemy import ForeignKey, DateTime, UUID as UUID_PG
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.database.core import Base
from app.database.utils import UUIDMixin, InitMixin

if TYPE_CHECKING:
    from app.product.models import ProductModel


class CancelListModel(UUIDMixin, InitMixin, Base):
    __tablename__ = "cancel_lists"

    status: Mapped[str] = mapped_column(nullable=False)
    amount: Mapped[Optional[int]] = mapped_column(nullable=True)
    ccy: Mapped[Optional[int]] = mapped_column(nullable=True)
    createdDate: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    modifiedDate: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    approvalCode: Mapped[Optional[str]] = mapped_column(nullable=True)
    rrn: Mapped[Optional[str]] = mapped_column(nullable=True)
    extRef: Mapped[Optional[str]] = mapped_column(nullable=True)
    payment_id: Mapped[UUID] = mapped_column(UUID_PG(as_uuid=True), ForeignKey("payments.id"), unique=True,
                                             nullable=False)
    payment: Mapped["PaymentModel"] = relationship("PaymentModel", back_populates="cancelList")


class PaymentInfoModel(UUIDMixin, InitMixin, Base):
    __tablename__ = "payments_info"

    maskedPan: Mapped[str] = mapped_column(nullable=False)
    approvalCode: Mapped[Optional[str]] = mapped_column(nullable=True)
    rrn: Mapped[Optional[str]] = mapped_column(nullable=True)
    trainId: Mapped[Optional[str]] = mapped_column(nullable=True)
    terminal: Mapped[str] = mapped_column(nullable=False)
    bank: Mapped[Optional[str]] = mapped_column(nullable=True)
    paymentSystem: Mapped[str] = mapped_column(nullable=False)
    paymentMethod: Mapped[str] = mapped_column(nullable=False)
    fee: Mapped[Optional[int]] = mapped_column(nullable=True)
    country: Mapped[Optional[str]] = mapped_column(nullable=True)
    agentFee: Mapped[Optional[int]] = mapped_column(nullable=True)
    payment_id: Mapped[UUID] = mapped_column(UUID_PG(as_uuid=True), ForeignKey("payments.id"), unique=True,
                                             nullable=False)
    payment: Mapped["PaymentModel"] = relationship("PaymentModel", back_populates="paymentInfo")


class WalletDataModel(UUIDMixin, InitMixin, Base):
    __tablename__ = "wallets_data"

    cardToken: Mapped[str] = mapped_column(nullable=False)
    walletId: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(nullable=False)
    payment_id: Mapped[UUID] = mapped_column(UUID_PG(as_uuid=True), ForeignKey("payments.id"), nullable=False,
                                             unique=True)
    payment: Mapped["PaymentModel"] = relationship("PaymentModel", back_populates="walletData")


class TipsInfoModel(UUIDMixin, InitMixin, Base):
    __tablename__ = "tips_info"

    employeeId: Mapped[str] = mapped_column(nullable=False)
    amount: Mapped[Optional[int]] = mapped_column(nullable=True)
    payment_id: Mapped[UUID] = mapped_column(UUID_PG(as_uuid=True), ForeignKey("payments.id"), nullable=False,
                                             unique=True)
    payment: Mapped["PaymentModel"] = relationship("PaymentModel", back_populates="tipsInfo")


class PaymentModel(UUIDMixin, InitMixin, Base):
    __tablename__ = "payments"

    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id", ondelete="SET NULL"), nullable=False, index=True)
    customer_email: Mapped[str] = mapped_column(nullable=False)
    invoice: Mapped[str] = mapped_column(nullable=False, unique=True, index=True)
    status: Mapped[str] = mapped_column(nullable=False)
    failureReason: Mapped[Optional[str]] = mapped_column(nullable=True)
    errorCode: Mapped[Optional[int]] = mapped_column(nullable=True)
    amount: Mapped[int] = mapped_column(nullable=False)
    ccy: Mapped[int] = mapped_column(nullable=False)
    finalAmount: Mapped[Optional[int]] = mapped_column(nullable=True)
    createdDate: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    modifiedDate: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    reference: Mapped[Optional[str]] = mapped_column(nullable=True)
    destination: Mapped[Optional[str]] = mapped_column(nullable=True)

    product: Mapped["ProductModel"] = relationship(
        "ProductModel",
        back_populates="payments",
        uselist=False,
    )

    cancelList: Mapped[Optional["CancelListModel"]] = relationship(
        "CancelListModel",
        back_populates="payment",
        cascade="all, delete-orphan"
    )
    paymentInfo: Mapped[Optional[PaymentInfoModel]] = relationship(
        "PaymentInfoModel",
        uselist=False,
        back_populates="payment",
        cascade="all, delete-orphan"
    )
    walletData: Mapped[Optional[WalletDataModel]] = relationship(
        "WalletDataModel",
        uselist=False,
        back_populates="payment",
        cascade="all, delete-orphan"
    )
    tipsInfo: Mapped[Optional[TipsInfoModel]] = relationship(
        "TipsInfoModel",
        uselist=False,
        back_populates="payment",
        cascade="all, delete-orphan"
    )
