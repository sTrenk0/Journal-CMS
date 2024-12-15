from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.core import router
from app.database.initial import create_initial_superuser
from app.exception_handlers import http_exception_internal_handler
from app.settings import config


def create_configured_app() -> FastAPI:
    @asynccontextmanager
    async def lifespan(*args, **kwargs):
        await create_initial_superuser()
        yield

    app = FastAPI(lifespan=lifespan, version=f"{config.api_version}")
    # put your localhost with your port of frontend app here
    origins = [
        config.app_domain_or_ip,
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)
    app.add_exception_handler(Exception, http_exception_internal_handler)
    return app
