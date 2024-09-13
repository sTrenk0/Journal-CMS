from typing import Generator, Any

import pytest
import asyncio
import os
from pathlib import Path
from fastapi.testclient import TestClient

from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from backend.app.auth.hash import Hasher
from backend.app.settings import postgres_url_test
from backend.app.database.models import User
from backend.app.main import app
from backend.app.database.dal import UserDAL
from logging import Logger

engine = create_async_engine(postgres_url_test)
session_maker = async_sessionmaker(engine, expire_on_commit=True)
metadata = MetaData()

logger = Logger(__name__)

test_user_source_password = "password123"
test_user_data = {
    "email": "test@me.com",
    "hashed_password": Hasher.get_password_hash(test_user_source_password),
    "is_active": True,
    "is_superuser": False
}


@pytest.fixture(scope="session")
async def async_test_session() -> AsyncSession:
    async with session_maker() as session:
        yield session


@pytest.fixture(scope="session", autouse=True)
def event_loop():
    logger.debug("Setting up event loop")
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    logger.debug("Closing event loop")
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def create_test_db():
    logger.debug("Creating test database")
    test_table = User.to_metadata(metadata, name="test_users")
    async with engine.begin() as conn:
        await conn.run_sync(metadata.create_all, tables=[test_table])
    logger.debug("Test database created")
    yield

    logger.debug("Dropping test database")
    async with engine.begin() as conn:
        await conn.run_sync(metadata.drop_all, tables=[test_table])

    logger.debug("Dropped test database")


@pytest.fixture(scope="session")
async def user_dal_override(async_test_session) -> UserDAL:
    return UserDAL(async_test_session)


@pytest.fixture(scope="session")
async def app_client(user_dal_override) -> Generator[TestClient, Any, None]:
    app.dependency_overrides[UserDAL.get_as_dependency] = user_dal_override
    async with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
async def create_user(user_dal_override):
    async def create_user_wrapper(
            email: str, hashed_password: str,
            is_active: bool = True, is_superuser: bool = False
    ) -> User:
        created_user = await user_dal_override.create_user(
            email=email, hashed_password=hashed_password,
            is_active=is_active, is_superuser=is_superuser,
        )
        return created_user

    return create_user_wrapper


@pytest.fixture(scope="session", autouse=True)
async def created_example_user(create_user):
    created_user = await create_user(**test_user_data)
    yield created_user
