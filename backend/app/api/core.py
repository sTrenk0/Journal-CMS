from fastapi import APIRouter

from app.settings import config

from .routes.auth import auth_router
from .routes.payment import admin_payment_router, payment_router
from .routes.product import admin_product_router, product_router
from .routes.user import user_router

router = APIRouter(prefix=f"/api/{config.api_version}")

router.include_router(auth_router, tags=["auth"], prefix="/auth")

router.include_router(user_router, tags=["admin-users"], prefix="/admin/users")

router.include_router(product_router, tags=["products"], prefix="/products")

router.include_router(
    admin_product_router, tags=["admin-products"], prefix="/admin/products"
)

router.include_router(payment_router, tags=["payments"], prefix="/payments")

router.include_router(
    admin_payment_router, tags=["admin-payments"], prefix="/admin/payments"
)
