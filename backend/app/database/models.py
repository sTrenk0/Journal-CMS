import uuid

from sqlalchemy.orm import Mapped, mapped_column, declarative_base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
                                     server_default=text("gen_random_uuid()"), nullable=False)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, server_default="true", nullable=True)
    is_superuser: Mapped[bool] = mapped_column(default=False, server_default="false", nullable=True)


print(Base.metadata.tables)