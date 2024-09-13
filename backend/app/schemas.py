from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID


class TunedModel:
    """tells pydantic to convert even non dict obj to json and forbid extra attributes"""
    model_config = ConfigDict(from_attributes=True, extra="forbid")


class DumpModelMixin(BaseModel):
    def create_update_dict(self, safe=True):
        if safe:
            return self.model_dump(
                exclude_unset=True,
                exclude={
                    "id",
                    "is_superuser",
                    "is_active",
                },
            )
        else:
            return self.model_dump(
                exclude_unset=True, exclude={"id"}
            )


class CreateUser(DumpModelMixin, TunedModel):
    email: EmailStr
    password: str
    is_active: bool
    is_superuser: bool


class UpdateUser(DumpModelMixin, TunedModel):
    email: EmailStr
    password: str
    is_active: bool
    is_superuser: bool


class ResponseUser(BaseModel, TunedModel):
    id: UUID
    is_active: bool
    email: EmailStr
    is_superuser: bool


