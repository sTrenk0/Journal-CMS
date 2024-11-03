from app.settings import config
from celery import Celery
from pathlib import Path


class CeleryConfig:
    broker_url = config.redis_url(db=1)
    task_serializer = "json"
    accept_content = ["json"]
    enable_utc = True
    include = Path(__file__).parent / "tasks.py"


celery_app = Celery(
    "celery_app",
)
celery_app.config_from_object(CeleryConfig)
