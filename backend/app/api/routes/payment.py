import datetime
from typing import Annotated, List
from uuid import UUID

import redis.asyncio as aioredis
from fastapi import (
    APIRouter,
    BackgroundTasks,
    Body,
    Depends,
    Header,
    HTTPException,
    Query,
    Response,
    status,
)

from app.auth.deps import get_current_active_user
from app.auth.openapi_responses import FORBIDDEN_RESPONSE, UNAUTHORIZED_RESPONSE
from app.database.redis import get_redis_connection
from app.email_utils import ProductEmailTemplate
from app.payment.dal import (
    CancelListDal,
    PaymentDAL,
    PaymentInfoDal,
    TipsInfoDal,
    WalletDataDal,
)
from app.payment.errors import PaymentError
from app.payment.openapi_responses import PAYMENT_NOT_FOUND_RESPONSE
from app.payment.schemas import (
    CancelList,
    Payment,
    PaymentInfo,
    PaymentResponse,
    TipsInfo,
    WalletData,
)
from app.payment.utils import (
    check_on_data_relevance,
    decode_data_from_redis_storage,
    prepare_data_to_redis_storage,
    verify_payment_hook,
)
from app.product.dal import ProductDAL

admin_payment_router = APIRouter()
payment_router = APIRouter()


@payment_router.post(
    "/hook",
    status_code=status.HTTP_200_OK,
)
async def payment_hook(
    x_sign_base64: Annotated[str, Header(alias="x-sign")],
    product_id: Annotated[UUID, Query()],
    customer_email: Annotated[str, Query()],
    body: Annotated[dict, Body()],
    payment_dal: Annotated[PaymentDAL, Depends(PaymentDAL.get_as_dependency)],
    cancel_list_dal: Annotated[CancelListDal, Depends(CancelListDal.get_as_dependency)],
    wallet_data_dal: Annotated[WalletDataDal, Depends(WalletDataDal.get_as_dependency)],
    tips_info_dal: Annotated[TipsInfoDal, Depends(TipsInfoDal.get_as_dependency)],
    payment_info_dal: Annotated[
        PaymentInfoDal, Depends(PaymentInfoDal.get_as_dependency)
    ],
    redis: Annotated["aioredis.Redis", Depends(get_redis_connection)],
    background_tasks: BackgroundTasks,
    product_dal: Annotated[ProductDAL, Depends(ProductDAL.get_as_dependency)],
) -> Response:
    """
    this path operation is only used as a get webhook, from the api.monobank domain.
    """
    if verify_payment_hook(x_sign_base64, body):
        stored_payment = await redis.get(body.get("invoiceId"))
        if stored_payment:
            stored_modified_date = decode_data_from_redis_storage(stored_payment)[
                "modifiedDate"
            ]
            requested_modified_date = body.get("modifiedDate")
            if not check_on_data_relevance(
                requested_modified_date, stored_modified_date
            ):
                return Response(status_code=200, headers={"X-Sign": x_sign_base64})

        payment = Payment(
            **body, product_id=product_id, customer_email=customer_email
        ).model_dump(exclude_unset=True)
        cancel_list = (
            CancelList(**body["cancelList"]).model_dump(exclude_unset=True)
            if body.get("cancelList")
            else None
        )
        wallet_data = (
            WalletData(**body["walletData"]).model_dump(exclude_unset=True)
            if body.get("walletData")
            else None
        )
        tips_info = (
            TipsInfo(**body["tipsInfo"]).model_dump(exclude_unset=True)
            if body.get("tipsInfo")
            else None
        )
        payment_info = (
            PaymentInfo(**body["paymentInfo"]).model_dump(exclude_unset=True)
            if body.get("paymentInfo")
            else None
        )

        if payment["status"] == "success":
            new_payment = await payment_dal.create(payment)
            if cancel_list:
                await cancel_list_dal.create(new_payment.id, cancel_list)

            if wallet_data:
                await wallet_data_dal.create(new_payment.id, wallet_data)
            if tips_info:
                await tips_info_dal.create(new_payment.id, tips_info)
            if payment_info:
                await payment_info_dal.create(new_payment.id, payment_info)

            product = await product_dal.get_by_id(product_id, only_is_active=True)
            email = ProductEmailTemplate(
                payment["customer_email"], product.source_product_url
            )
            background_tasks.add_task(email.send)
        else:
            payment = prepare_data_to_redis_storage(
                {
                    **payment,
                    "cancelList": cancel_list,
                    "walletData": wallet_data,
                    "tipsInfo": tips_info,
                    "paymentInfo": payment_info,
                },
                convert_to_json=True,
            )
            await redis.set(body["invoiceId"], payment)
            await redis.expire(body["invoiceId"], datetime.timedelta(days=3))

        return Response(status_code=200, headers={"X-Sign": x_sign_base64})

    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)


@admin_payment_router.get(
    "/invoice/{invoice}",
    dependencies=[Depends(get_current_active_user)],
    response_model=PaymentResponse,
    responses={
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE,
        **PAYMENT_NOT_FOUND_RESPONSE,
    },
)
async def get_payment_by_invoice(
    invoice: str,
    payment_dal: Annotated[PaymentDAL, Depends(PaymentDAL.get_as_dependency)],
    redis: Annotated["aioredis.Redis", Depends(get_redis_connection)],
):
    """
    available for active users and superuser.
    This path operation is designed to get by invoice a successful completed payment.
    """

    payment = await payment_dal.get_by_invoice(invoice)
    if not payment:
        payment = await redis.get(invoice)
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=PaymentError.NOT_FOUND
            )

    payment = decode_data_from_redis_storage(payment)
    return payment


@admin_payment_router.get(
    "/",
    dependencies=[Depends(get_current_active_user)],
    responses={
        **UNAUTHORIZED_RESPONSE,
        **FORBIDDEN_RESPONSE,
        **PAYMENT_NOT_FOUND_RESPONSE,
    },
    response_model=List[PaymentResponse],
)
async def get_all_payments(
    payment_dal: Annotated[PaymentDAL, Depends(PaymentDAL.get_as_dependency)],
    redis: Annotated["aioredis.Redis", Depends(get_redis_connection)],
):
    """
    available for active users and superuser
    This path operation is designed to get all completed payments.
    """
    payments = []
    payments_from_postgres = await payment_dal.get_all()
    payments_invoice_stored_in_postgres = [
        payment.invoice for payment in payments_from_postgres
    ]
    payments_invoice_stored_in_redis = await redis.keys("*")
    uncompleted_payments_invoice = set(payments_invoice_stored_in_redis) - set(
        payments_invoice_stored_in_postgres
    )
    for invoice in uncompleted_payments_invoice:
        payment = await redis.get(invoice)
        payment = decode_data_from_redis_storage(payment)
        payments.append(payment)

    payments.extend(payments_from_postgres)

    return payments
