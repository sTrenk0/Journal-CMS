from fastapi import APIRouter

from .routes.auth import auth_router
from .routes.users import user_router
from .routes.products import product_router, admin_product_router

router = APIRouter(prefix="/api")

router.include_router(
    auth_router, tags=["auth"], prefix="/auth"
)

router.include_router(
    user_router, tags=["admin-users"], prefix="/admin/users"
)

router.include_router(
    product_router, tags=["products"], prefix="/products"
)

router.include_router(
    admin_product_router, tags=["admin-products"], prefix="/admin/products"
)
