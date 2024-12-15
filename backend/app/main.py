import uvicorn
from .configure_app import create_configured_app
from .settings import config
from .logger import configure_uvicorn_logger

import logging

logging.getLogger()
fastapi_app = create_configured_app()
log_config = configure_uvicorn_logger()


if __name__ == "__main__":
    uvicorn.run(
        "app.main:fastapi_app",
        host="0.0.0.0",  # noqa: S104 (this interface is only available on the closed docker network)
        port=config.app_port,
        reload=True,
        log_config=log_config,
        log_level="debug",
    )
