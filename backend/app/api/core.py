from fastapi import APIRouter
from .routes.auth import auth_router
from .routes.user import user_router
from .routes.product import product_router, admin_product_router
from .routes.payment import payment_router, admin_payment_router
from app.settings import config

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
