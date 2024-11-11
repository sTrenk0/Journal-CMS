from typing import Dict, Union

from pydantic import BaseModel, ConfigDict


class TunedModel:
    """tells pydantic to convert even non dict obj to json and forbid extra attributes"""

    model_config = ConfigDict(from_attributes=True, extra="forbid")


class ErrorModel(BaseModel):
    detail: Union[str, Dict[str, str]]
