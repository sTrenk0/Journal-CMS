from fastapi import APIRouter

from app.api.routes.auth import auth_router
from app.api.routes.users import user_router

router = APIRouter(prefix="/api")


router.include_router(
    auth_router, tags=["auth"], prefix="/auth"
)


router.include_router(
    user_router, tags=["users"], prefix="/users"
)