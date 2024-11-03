from app.settings import config
import redis.asyncio as aioredis


async def get_redis_connection() -> aioredis.Redis:
    redis = aioredis.from_url(config.redis_url(db=1), encoding="utf-8", decode_responses=True)
    try:
        yield redis
    finally:
        await redis.close()

