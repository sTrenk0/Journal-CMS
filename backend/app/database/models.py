import uuid
import datetime

from sqlalchemy.orm import Mapped, mapped_column, declarative_base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text, DateTime, JSON, UniqueConstraint
from sqlalchemy.orm import declarative_mixin

Base = declarative_base()


@declarative_mixin
class UUIDMixin:
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"), nullable=False
    )


class User(UUIDMixin, Base):
    __tablename__ = "users"
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, server_default="true", nullable=False)
    is_superuser: Mapped[bool] = mapped_column(default=False, server_default="false", nullable=False)


class Product(UUIDMixin, Base):
    __tablename__ = "products"
    name: Mapped[str] = mapped_column(nullable=False, unique=True)
    source_product_url: Mapped[str] = mapped_column(nullable=False, unique=True)
    description: Mapped[str] = mapped_column(nullable=True)
    price: Mapped[int] = mapped_column(nullable=False)
    preview_urls: Mapped[list[str]] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True, server_default="true", nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.datetime.now(datetime.timezone.utc),
        nullable=False, server_default=text("now()")
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.datetime.now(datetime.timezone.utc),
        nullable=False, server_default=text("now()"), onupdate=text("now()")
    )
    __table_args__ = (
        UniqueConstraint('name', 'source_product_url', name='unique_name_source_product_url_constraint'),
    )