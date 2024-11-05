from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.initial import create_initial_superuser
from .settings import config
from .api.core import router
from .internal_exception_handler import http_exception_internal_handler
from app.product.errors import ProductError
from fastapi import status, HTTPException


@asynccontextmanager
async def lifespan(*args, **kwargs):
    await create_initial_superuser()
    yield


# put your localhost with your port of frontend app here
origins = [
    "http://localhost",
    "http://localhost:5173",
]
fastapi_app = FastAPI(
    lifespan=lifespan,
    version=f"{config.api_version}",
)
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
fastapi_app.include_router(router)
fastapi_app.add_exception_handler(Exception, http_exception_internal_handler)


@fastapi_app.get("/one")
def raise_err():
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=ProductError.NOT_FOUND
    )


# use this in case when you want run app directly without docker
# if __name__ == "__main__":
#     import uvicorn
#     from .settings import config
#
#     uvicorn.run(
#         "app.main:fastapi_app", host="0.0.0.0", port=config.app_port, reload=True
#     )
