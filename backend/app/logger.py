from typing import TYPE_CHECKING

from fastapi.logger import logger

if TYPE_CHECKING:
    from logging import Logger


def get_logger() -> Logger:
    return logger
