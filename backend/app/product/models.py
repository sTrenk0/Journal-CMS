import datetime
from typing import TYPE_CHECKING, List

from sqlalchemy import (
    JSON,
    DateTime,
    UniqueConstraint,
    text,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.core import Base
from app.database.utils import InitMixin, UUIDMixin

if TYPE_CHECKING:
    from app.payment.models import PaymentModel


class ProductModel(UUIDMixin, InitMixin, Base):
    __tablename__ = "products"
    name: Mapped[str] = mapped_column(nullable=False, unique=True)
    source_product_url: Mapped[str] = mapped_column(nullable=False, unique=True)
    description: Mapped[str] = mapped_column(nullable=True)
    preview_urls: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    is_active: Mapped[bool] = mapped_column(
        default=True, server_default="true", nullable=False
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.datetime.now(datetime.timezone.utc),
        nullable=False,
        server_default=text("now()"),
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.datetime.now(datetime.timezone.utc),
        nullable=False,
        server_default=text("now()"),
        onupdate=text("now()"),
    )

    payments: Mapped[List["PaymentModel"]] = relationship(
        "PaymentModel",
        back_populates="product",
        uselist=True,
    )
    __table_args__ = (
        UniqueConstraint(
            "name",
            "source_product_url",
            name="unique_name_source_product_url_constraint",
        ),
    )

    def __repr__(self):
        return f"""
        Product(id={self.id!r},
        name={self.name!r},
        source_product_url={self.source_product_url!r},
        preview_urls={self.preview_urls!r}
        description={self.description!r}
        is_active={self.is_active!r},
        created_at={self.created_at!r},
        updated_at={self.updated_at!r}
        )
    """
