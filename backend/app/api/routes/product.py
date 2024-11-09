from typing import List, Annotated
from uuid import UUID
from fastapi import (
    APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
)
from pydantic import EmailStr

from app.product.errors import ProductError
from app.auth.deps import get_current_active_user
from app.product.schemas import (
    CreateProduct, UpdateProduct, ProductResponse,
    ProductPublicResponse, ProductStatsResponse
)
from app.product.dal import ProductDAL
from app.payment.dal import PaymentDAL

from app.product.openapi_responses import (
    PRODUCT_NOT_FOUND_RESPONSE,
    PRODUCT_WITH_NAME_OR_SOURCE_URL_ALREADY_EXISTS_RESPONSE
)
from app.auth.openapi_responses import FORBIDDEN_RESPONSE, UNAUTHORIZED_RESPONSE
from app.email_utils import ProductEmailTemplate

product_router = APIRouter()
admin_product_router = APIRouter()


@admin_product_router.post(
    "/",
    response_model=ProductResponse,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **PRODUCT_WITH_NAME_OR_SOURCE_URL_ALREADY_EXISTS_RESPONSE,
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE
    }
)
async def add_product(
        body: CreateProduct,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency)
):
    """
    Available for active users and superuser
    """
    create_product_data = body.dumb_dict_for_create()
    product = await product_dal.get_by_name_and_url(
        create_product_data["name"], create_product_data["source_product_url"]
    )
    if product:
        if product.source_product_url == create_product_data["source_product_url"]:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, ProductError.SOURCE_URL_ALREADY_EXISTS,
            )
        if product.name == create_product_data["name"]:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, ProductError.NAME_ALREADY_EXISTS
            )
    created_product = await product_dal.create(**create_product_data)
    return created_product


@admin_product_router.get(
    "/",
    response_model=List[ProductResponse],
    dependencies=[Depends(get_current_active_user)],
    responses={
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE
    }
)
async def get_all_products(
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency),
):
    """
    Get is_active/inactive all products, available for active users and superuser
    """
    products = await product_dal.get_all(only_is_active=False)
    return products


@product_router.get(
    "/",
    response_model=List[ProductPublicResponse],
)
async def get_only_active_products(
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency),
):
    products = await product_dal.get_all(only_is_active=True)
    return list(map(ProductPublicResponse.model_validate, products))


@admin_product_router.get(
    "/id/{product_id}",
    response_model=ProductResponse,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE,
        **PRODUCT_NOT_FOUND_RESPONSE
    }
)
async def get_product_by_id(
        product_id: UUID,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency)
):
    """
    Get is_active/inactive product by id, available for active users and superuser
    """
    product = await product_dal.get_by_id(product_id, only_is_active=False)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ProductError.NOT_FOUND
        )
    return product


@product_router.get(
    "/id/{product_id}",
    response_model=ProductPublicResponse,
    responses={
        **PRODUCT_NOT_FOUND_RESPONSE
    }
)
async def get_only_active_product_by_id(
        product_id: UUID,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency),
):
    product = await product_dal.get_by_id(product_id, only_is_active=True)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ProductError.NOT_FOUND
        )
    return ProductPublicResponse.model_validate(product, from_attributes=True)


@product_router.get(
    "/name/{product_name}",
    response_model=ProductPublicResponse,
    responses={
        **PRODUCT_NOT_FOUND_RESPONSE
    }
)
async def get_only_active_product_by_name(
        product_name: str,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency)
):
    product = await product_dal.get_by_name(product_name, only_is_active=True)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ProductError.NOT_FOUND
        )
    return ProductPublicResponse.model_validate(product, from_attributes=True)


@admin_product_router.patch(
    "/{product_id}",
    response_model=ProductResponse,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **PRODUCT_NOT_FOUND_RESPONSE,
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE
    }
)
async def update_product(
        product_id: UUID,
        body: UpdateProduct,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency)
):
    """
    available for active users and superuser
    """
    product = await product_dal.get_by_id(product_id, only_is_active=False)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ProductError.NOT_FOUND
        )
    product = await product_dal.update(product, **body.dumb_dict_for_update())
    return product


@admin_product_router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **PRODUCT_NOT_FOUND_RESPONSE,
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE
    }
)
async def delete_product(
        product_id: UUID,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency)
):
    """
    available for active users and superuser
    """
    product = await product_dal.get_by_id(product_id, only_is_active=False)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ProductError.NOT_FOUND
        )
    await product_dal.delete(product)


@admin_product_router.get(
    "/statistic/",
    response_model=List[ProductStatsResponse],
    dependencies=[Depends(get_current_active_user)],
    responses={
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE
    }
)
async def get_product_statistic(
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency),
        payment_dal: PaymentDAL = Depends(PaymentDAL.get_as_dependency)
):
    """
    available for active users and superuser
    """
    statistic = []
    count = {}
    products = await product_dal.get_all(only_is_active=False)
    products_names = set(map(lambda p: p.name, products))
    payments = await payment_dal.get_all()
    for payment in payments:
        if payment.product.name in products_names:
            count[payment.product.name] = count.get(payment.product.name, 0) + 1

    for product in products:
        statistic.append(
            ProductStatsResponse(
                id=product.id,
                name=product.name,
                sold=count.get(product.name, 0)
            )
        )
    return statistic


@admin_product_router.post(
    "/send",
    dependencies=[Depends(get_current_active_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        **FORBIDDEN_RESPONSE,
        **UNAUTHORIZED_RESPONSE,
        **PRODUCT_NOT_FOUND_RESPONSE
    }
)
async def send_manual_product(
        product_id: Annotated[UUID, Query()],
        email_to: Annotated[EmailStr, Query()],
        product_dal: Annotated[ProductDAL, Depends(ProductDAL.get_as_dependency)],
        background_tasks: BackgroundTasks):

    product = await product_dal.get_by_id(product_id, only_is_active=True)
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, ProductError.NOT_FOUND)
    email = ProductEmailTemplate(
        email_to=email_to, source_product_url=product.source_product_url
    )
    background_tasks.add_task(email.send)
    return



