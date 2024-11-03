from .core import get_async_session
from app.auth.hash import Hasher
from app.user.dal import UserDAL
from app.settings import config


async def create_initial_superuser():
    async for db_session in get_async_session():
        user_dal = UserDAL(db_session)
        exists_superuser = await user_dal.get_by_email(config.app_initial_superuser_email)
        if not exists_superuser:
            await user_dal.create(
                hashed_password=Hasher.get_password_hash(config.app_initial_superuser_password),
                email=config.app_initial_superuser_email,
                is_superuser=True,
                is_active=True,
            )
