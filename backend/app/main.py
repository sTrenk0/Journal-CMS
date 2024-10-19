from contextlib import asynccontextmanager

from fastapi import FastAPI

from .api.core import router
from .database.initial import create_initial_superuser

#Temporary cors
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app):
    await create_initial_superuser()
    yield


fastapi_app = FastAPI(lifespan=lifespan)
fastapi_app.include_router(router)

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers (Authorization, etc.)
)

@fastapi_app.get("/")
async def root():
    return {"message": "Hello World"}


# use this in case when you want run app directly without docker
# if __name__ == "__main__":
#     import uvicorn
#     from .settings import config
#     uvicorn.run("app.main:fastapi_app", host="0.0.0.0", port=config.app_port, reload=True)
