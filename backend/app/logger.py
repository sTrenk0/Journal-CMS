import sys
import logging

import uvicorn

log_fmt = "%(asctime)s - %(levelname)s - %(message)s"
datefmt = "%d-%m-%Y %H:%M:%S"


def configure_logger(level: int = logging.INFO, error: bool = False) -> None:
    stream = sys.stdout
    if error:
        stream = sys.stderr

    logging.basicConfig(
        level=level,
        format=log_fmt,
        datefmt=datefmt,
        handlers=[logging.StreamHandler(stream=stream)],
    )


def configure_uvicorn_logger(level: int = logging.INFO) -> dict:
    log_config = uvicorn.config.LOGGING_CONFIG
    log_config["formatters"]["access"]["datefmt"] = datefmt
    log_config["formatters"]["access"]["fmt"] = log_fmt
    log_config["formatters"]["default"]["datefmt"] = datefmt
    log_config["formatters"]["default"]["fmt"] = log_fmt

    log_config["loggers"]["uvicorn"]["level"] = level
    log_config["loggers"]["uvicorn.error"]["level"] = level
    log_config["loggers"]["uvicorn.access"]["level"] = level
    return log_config
