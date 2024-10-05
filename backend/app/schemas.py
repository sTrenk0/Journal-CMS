from datetime import datetime
from typing import Union, Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict, HttpUrl, Field
from uuid import UUID


class TunedModel:
    """tells pydantic to convert even non dict obj to json and forbid extra attributes"""
    model_config = ConfigDict(from_attributes=True, extra="forbid")


class UserDumpModelMixin(BaseModel):
    def create_update_dict(self):
        return self.model_dump(
            exclude_unset=True,
        )


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


class CreateUser(UserDumpModelMixin, TunedModel):
    email: EmailStr
    password: str
    is_active: bool = True


class UpdateUser(UserDumpModelMixin, TunedModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class ResponseUser(BaseModel, TunedModel):
    id: UUID
    is_active: bool
    email: EmailStr
    is_superuser: bool


class CreateProduct(TunedModel, ProductDumpModelMixin):
    name: str
    source_product_url: HttpUrl
    preview_urls: Optional[List[HttpUrl]] = Field(default=[], max_items=3)
    is_active: Optional[bool] = True
    description: Optional[str] = None
    price: int


class UpdateProduct(TunedModel, ProductDumpModelMixin):
    name: Optional[str] = None
    source_product_url: Optional[HttpUrl] = None
    preview_urls: Optional[list[HttpUrl]] = Field(None, max_items=3)
    is_active: Optional[bool] = None
    description: Optional[str] = None
    price: Optional[int] = None


class ResponseProduct(TunedModel, BaseModel):
    id: UUID
    name: str
    source_product_url: HttpUrl
    preview_urls: list[HttpUrl]
    is_active: bool
    description: str
    price: int
    created_at: Union[datetime, str]
    updated_at: Union[datetime, str]
