from sqlalchemy.orm import mapped_column, Mapped
from app.database.core import Base
from app.database.utils import UUIDMixin, InitMixin


class UserModel(UUIDMixin, InitMixin, Base):
    __tablename__ = "users"
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, server_default="true", nullable=False)
    is_superuser: Mapped[bool] = mapped_column(default=False, server_default="false", nullable=False)

    def __repr__(self):
        return f"User(email={self.email}, is_active={self.is_active}, is_superuser={self.is_superuser})"
