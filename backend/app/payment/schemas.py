from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import (
    AliasChoices,
    BaseModel,
    ConfigDict,
    Field,
)

from app.schemas_utils import TunedModel


class PaymentSchemaConfig:
    model_config = ConfigDict(from_attributes=True, extra="ignore")


class CancelList(BaseModel, PaymentSchemaConfig):
    status: str
    amount: Optional[int] = None
    ccy: Optional[int] = None
    createdDate: Optional[datetime] = None
    modifiedDate: Optional[datetime] = None
    approvalCode: Optional[str] = None
    rrn: Optional[str] = None
    extRef: Optional[str] = None


class PaymentInfo(BaseModel, PaymentSchemaConfig):
    maskedPan: str
    approvalCode: Optional[str] = None
    rrn: Optional[str] = None
    trainId: Optional[str] = None
    terminal: str
    bank: Optional[str] = None
    paymentSystem: str
    paymentMethod: str
    fee: Optional[int] = None
    country: Optional[str] = None
    agentFee: Optional[int] = None


class WalletData(BaseModel, PaymentSchemaConfig):
    cardToken: str
    walletId: str
    status: str


class TipsInfo(BaseModel, PaymentSchemaConfig):
    employeeId: str
    amount: Optional[int] = None


class Payment(BaseModel, PaymentSchemaConfig):
    product_id: UUID
    customer_email: str
    invoice: str = Field(validation_alias=AliasChoices("invoiceId", "invoice"))
    status: str
    failureReason: Optional[str] = None
    errorCode: Optional[int] = None
    amount: int
    ccy: int
    finalAmount: Optional[int] = None
    createdDate: Optional[datetime] = None
    modifiedDate: Optional[datetime] = None
    reference: Optional[str] = None
    destination: Optional[str] = None


class PaymentResponse(Payment, TunedModel):
    product_id: UUID
    cancelList: Optional[List[CancelList]] = None
    paymentInfo: Optional[PaymentInfo] = None
    walletData: Optional[WalletData] = None
    tipsInfo: Optional[TipsInfo] = None
