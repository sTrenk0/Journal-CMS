from contextlib import asynccontextmanager
from fastapi import FastAPI
from .database.initial import create_initial_superuser
from .settings import config
from .api.core import router


@asynccontextmanager
async def lifespan(*args, **kwargs):
    await create_initial_superuser()
    yield

fastapi_app = FastAPI(
    lifespan=lifespan,
    version=f"{config.api_version}",
)
fastapi_app.include_router(router)

# use this in case when you want run app directly without docker
# if __name__ == "__main__":
    # import uvicorn
    # from .settings import config
    # uvicorn.run("app.main:fastapi_app", host="0.0.0.0", port=config.app_port, reload=True)
