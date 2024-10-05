import datetime
from http.cookies import SimpleCookie
from typing import Union

from contextlib import contextmanager
import pytest

from alembic import command
from alembic.config import Config

import psycopg2
from pathlib import Path
from fastapi.testclient import TestClient

from sqlalchemy import create_engine, select
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import Session

from app.auth.auntification import create_access_token
from app.auth.hash import Hasher
from app.auth.transport import CookieTransport
from app.settings import config
from app.main import fastapi_app
from app.database.models import User

from logging import Logger

test_db_name = "test_service"

logger = Logger(__name__)
test_user_source_password = "qwerty12345"
test_user_data = {
    "email": "test_user_email@example.com",
    "hashed_password": Hasher.get_password_hash(test_user_source_password),
    "is_active": True,
    "is_superuser": False
}


@pytest.fixture(scope="session")
def mock_config_postgres_test_db(session_mocker):
    session_mocker.patch(
        "app.database.core.async_engine",
        create_async_engine(
            f"postgresql+asyncpg://{config.postgres_user}:{config.postgres_password}@{config.postgres_host_name}:{config.postgres_port}/{test_db_name}"
        )
    )
    from app.database.core import async_engine
    session_mocker.patch(
        "app.database.core.async_session_maker",
        async_sessionmaker(
            async_engine,
            expire_on_commit=False,
        )
    )


@pytest.fixture(scope="session", autouse=True)
def create_test_db(mock_config_postgres_test_db):
    @contextmanager
    def create_conn():
        conn = psycopg2.connect(
            dbname=config.postgres_db,
            user=config.postgres_user,
            password=config.postgres_password,
            host=config.postgres_host_name,
            port=config.postgres_port
        )
        conn.autocommit = True
        cur = conn.cursor()
        yield cur
        cur.close()
        conn.close()

    with create_conn() as cursor:
        try:
            cursor.execute(f"CREATE DATABASE {test_db_name};")
        except psycopg2.errors.DuplicateDatabase:
            pass

    path_to_alembic_init = Path(__file__).parent.parent.parent.joinpath("alembic.ini").absolute()
    alembic_cfg = Config(str(path_to_alembic_init))
    alembic_cfg.set_main_option("script_location", str(path_to_alembic_init.parent.joinpath("alembic").absolute()))
    command.upgrade(alembic_cfg, "head")
    yield
    # time.sleep(5)
    # with create_conn() as cursor:
    #     cursor.execute(f"DROP DATABASE IF EXISTS {test_db_name};")


@pytest.fixture(scope="session")
def test_session() -> Session:
    sync_engine = create_engine(
        f"postgresql+psycopg2://{config.postgres_user}:{config.postgres_password}@{config.postgres_host_name}:{config.postgres_port}/{test_db_name}")
    with Session(sync_engine, expire_on_commit=True) as session:
        yield session


@pytest.fixture(scope="session")
def app_client() -> TestClient:
    with TestClient(fastapi_app) as client:
        yield client


@pytest.fixture(scope="session")
def create_user(test_session):
    def create_user_wrapper(
            email: str, hashed_password: str,
            is_active: bool = True, is_superuser: bool = False
    ) -> User:
        new_user = User(
            email=email,
            hashed_password=hashed_password,
            is_active=is_active,
            is_superuser=is_superuser
        )
        test_session.add(
            new_user
        )
        test_session.commit()
        test_session.refresh(new_user)
        return new_user

    return create_user_wrapper


@pytest.fixture(scope="session")
def get_user_by_email(test_session):
    def get_user_by_email_wrapper(email: str) -> Union[None, User]:
        try:
            statement = select(User).where(User.email == email)
            user = test_session.execute(statement).scalars().one()
            return user
        except NoResultFound:
            return

    return get_user_by_email_wrapper


@pytest.fixture(scope="session")
def created_example_user(create_user, get_user_by_email):
    user = get_user_by_email(test_user_data["email"])
    if not user:
        user = create_user(**test_user_data)

    yield user


@pytest.fixture(scope="session")
def create_test_cookie():
    def create_test_cookie_wrapper(email: str, expires_delta: datetime.timedelta = None) -> str:
        test_token = create_access_token(email, expires_delta=expires_delta)
        response_with_cookie = CookieTransport().get_login_response(test_token)
        return SimpleCookie(response_with_cookie.headers["set-cookie"])["token"].value

    return create_test_cookie_wrapper
