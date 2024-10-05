from contextlib import asynccontextmanager

from fastapi import FastAPI

from .api.core import router
from .database.initial import create_initial_superuser


@asynccontextmanager
async def lifespan(app):
    await create_initial_superuser()
    yield


fastapi_app = FastAPI(lifespan=lifespan)
fastapi_app.include_router(router)


@fastapi_app.get("/")
async def root():
    return {"message": "Hello World"}


# use this in case when you want run app directly without docker
# if __name__ == "__main__":
#     import uvicorn
#     from .settings import config
#     uvicorn.run("app.main:fastapi_app", host=config.app_host, port=config.app_port, reload=True)
