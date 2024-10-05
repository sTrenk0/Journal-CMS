from uuid import UUID


from fastapi import APIRouter, Depends, HTTPException, status

from app.errors import ErrorCode
from app.auth.deps import get_current_active_user
from app.schemas import CreateProduct, UpdateProduct, ResponseProduct
from app.database.dal import ProductDAL
from app.openapi_responses import PRODUCT_NOT_FOUND_RESPONSE, FORBIDDEN_RESPONSE, UNAUTHORIZED_RESPONSE, \
    PRODUCT_WITH_THIS_SOURCE_PRODUCT_URL_ALREADY_EXISTS_RESPONSE, PRODUCT_WITH_THIS_NAME_ALREADY_EXISTS_RESPONSE

product_router = APIRouter()
admin_product_router = APIRouter()


@admin_product_router.post(
    "/", response_model=ResponseProduct,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **PRODUCT_WITH_THIS_SOURCE_PRODUCT_URL_ALREADY_EXISTS_RESPONSE,
        **PRODUCT_WITH_THIS_NAME_ALREADY_EXISTS_RESPONSE,
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
    product = await product_dal.get_product_by_name_and_url(
        create_product_data["name"], create_product_data["source_product_url"]
    )
    if product:
        if product.source_product_url == create_product_data["source_product_url"]:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, ErrorCode.PRODUCT_WITH_THIS_SOURCE_PRODUCT_URL_ALREADY_EXISTS,
            )
        if product.name == create_product_data["name"]:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, ErrorCode.PRODUCT_WITH_THIS_NAME_ALREADY_EXISTS
            )
    created_product = await product_dal.create_product(**create_product_data)
    return created_product


@admin_product_router.get(
    "/", response_model=list[ResponseProduct],
    dependencies=[Depends(get_current_active_user)],
    responses={
        **FORBIDDEN_RESPONSE, **UNAUTHORIZED_RESPONSE
    }
)
async def get_all_products(
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency),
):
    """
    Get is_active/inactive all products, available for active users and superuser
    """
    products = await product_dal.get_all_products(only_is_active=False)
    return products


@product_router.get(
    "/", response_model=list[ResponseProduct],
)
async def get_only_active_products(
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency),
):
    products = await product_dal.get_all_products(only_is_active=True)
    return products


@admin_product_router.get(
    "/id/{product_id}", response_model=ResponseProduct,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **FORBIDDEN_RESPONSE, **UNAUTHORIZED_RESPONSE, **PRODUCT_NOT_FOUND_RESPONSE
    }
)
async def get_product_by_id(
        product_id: UUID,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency)
):
    """
    Get is_active/inactive product by id, available for active users and superuser
    """
    product = await product_dal.get_product_by_id(product_id, only_is_active=False)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ErrorCode.PRODUCT_NOT_FOUND
        )
    return product


@product_router.get(
    "/id/{product_id}", response_model=ResponseProduct,
    responses={
        **PRODUCT_NOT_FOUND_RESPONSE
    }
)
async def get_only_active_product_by_id(
        product_id: UUID,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency),
):
    product = await product_dal.get_product_by_id(product_id, only_is_active=True)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ErrorCode.PRODUCT_NOT_FOUND
        )
    return product


@product_router.get(
    "/name/{product_name}", response_model=ResponseProduct,
    responses={
        **PRODUCT_NOT_FOUND_RESPONSE
    }
)
async def get_only_active_product_by_name(
        product_name: str,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency)
):
    product = await product_dal.get_product_by_name(product_name, only_is_active=True)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ErrorCode.PRODUCT_NOT_FOUND
        )
    return product


@admin_product_router.patch(
    "/{product_id}", response_model=ResponseProduct,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **PRODUCT_NOT_FOUND_RESPONSE, **FORBIDDEN_RESPONSE, **UNAUTHORIZED_RESPONSE
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
    product = await product_dal.get_product_by_id(product_id, only_is_active=False)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ErrorCode.PRODUCT_NOT_FOUND
        )
    product = await product_dal.update_product(product, **body.dumb_dict_for_update())
    return product


@admin_product_router.delete(
    "/{product_id}", response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_active_user)],
    responses={
        **PRODUCT_NOT_FOUND_RESPONSE, **FORBIDDEN_RESPONSE, **UNAUTHORIZED_RESPONSE
    }
)
async def delete_product(
        product_id: UUID,
        product_dal: ProductDAL = Depends(ProductDAL.get_as_dependency)
):
    """
    available for active users and superuser
    """
    product = await product_dal.get_product_by_id(product_id, only_is_active=False)
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, ErrorCode.PRODUCT_NOT_FOUND
        )
    await product_dal.delete_product(product)
