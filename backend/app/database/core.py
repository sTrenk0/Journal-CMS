from typing import AsyncGenerator, TYPE_CHECKING
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession

engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/test_production")
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator["AsyncSession", None]:
    async with async_session_maker() as session:
        yield session
