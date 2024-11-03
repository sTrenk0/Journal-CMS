import uuid

from sqlalchemy import UUID, text
from sqlalchemy.orm import declarative_mixin, Mapped, mapped_column


@declarative_mixin
class UUIDMixin:
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
        nullable=False,
        index=True
    )


class InitMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)