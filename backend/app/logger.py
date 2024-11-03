from fastapi.logger import logger
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from logging import Logger


def get_logger() -> Logger:
    return logger
