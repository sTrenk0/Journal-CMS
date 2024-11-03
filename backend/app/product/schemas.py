from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl, ConfigDict

from app.schemas_utils import TunedModel


class ProductDumpModelMixin(BaseModel):
    def dumb_dict_for_create(self):
        dumped_model_dict = self.model_dump(
            exclude_unset=False
        )
        dumped_model_dict["preview_urls"] = [str(url) for url in dumped_model_dict["preview_urls"]]
        dumped_model_dict["source_product_url"] = str(dumped_model_dict["source_product_url"])
        return dumped_model_dict

    def dumb_dict_for_update(self):
        dumped_model_dict = self.model_dump(
            exclude_unset=True
        )
        if dumped_model_dict.get("preview_urls", None) is not None:
            dumped_model_dict["preview_urls"] = [str(url) for url in dumped_model_dict["preview_urls"]]
        if dumped_model_dict.get("source_product_url", None) is not None:
            dumped_model_dict["source_product_url"] = str(dumped_model_dict["source_product_url"])

        return dumped_model_dict


class CreateProduct(TunedModel, ProductDumpModelMixin):
    name: str
    source_product_url: HttpUrl
    preview_urls: List[HttpUrl] = Field(max_items=5, min_items=3)
    is_active: Optional[bool] = True
    description: Optional[str] = None


class UpdateProduct(TunedModel, ProductDumpModelMixin):
    name: Optional[str] = None
    source_product_url: Optional[HttpUrl] = None
    preview_urls: List[Optional[HttpUrl]] = Field([None], max_items=5, min_items=3)
    is_active: Optional[bool] = None
    description: Optional[str] = None


class ProductResponse(TunedModel, BaseModel):
    id: UUID
    name: str
    source_product_url: HttpUrl
    preview_urls: list[HttpUrl]
    is_active: bool
    description: str
    created_at: datetime
    updated_at: datetime


class ProductPublicResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")
    id: UUID
    name: str
    preview_urls: List[HttpUrl]
    description: str
    created_at: datetime
    updated_at: datetime


class ProductStatsResponse(TunedModel, BaseModel):
    id: UUID
    name: str
    sold: int
