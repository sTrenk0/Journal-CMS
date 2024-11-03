from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.schemas_utils import TunedModel


class UserDumpModelMixin(BaseModel):
    def create_update_dict(self):
        return self.model_dump(
            exclude_unset=True,
        )


class CreateUser(UserDumpModelMixin, TunedModel):
    email: EmailStr
    password: str
    is_active: bool = True


class UpdateUser(UserDumpModelMixin, TunedModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(BaseModel, TunedModel):
    id: UUID
    is_active: bool
    email: EmailStr
    is_superuser: bool
