from typing import AsyncGenerator, TYPE_CHECKING

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.settings import config

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession

async_engine = create_async_engine(config.postgres_url)
async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False)
Base = declarative_base()


async def get_async_session() -> AsyncGenerator["AsyncSession", None]:
    async with async_session_maker() as session:
        yield session
