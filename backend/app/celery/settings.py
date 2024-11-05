from app.settings import config
from celery import Celery
from pathlib import Path


class CeleryConfig:
    broker_url = config.redis_url(db=1)
    enable_utc = True
    timezone = "UTC"
    include = ["app.celery.tasks"]
    worker_prefetch_multiplier = 1

    task_annotations = {
        "*": {
            "retry_policy": {
                "max_retries": 3,
                "interval_start": 60,
            },
            "task_acks_late": True,
            "ignore_result": True,
            "task_publish_retry": True,
            "task_acks_on_failure_or_timeout": True,
            "task_reject_on_worker_lost": True,
            "task_time_limit": 60,
        }
    }

    broker_transport_options = {
        "max_retries": 5,
        "interval_start": 0,
        "interval_step": 1,
        "interval_max": 60,
    }


celery_app = Celery(
    "celery_app",
)

celery_app.config_from_object(CeleryConfig)
