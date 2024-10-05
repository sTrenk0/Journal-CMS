from typing import Union, Literal
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class _Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_ignore_empty=True,
        extra="ignore",
        case_sensitive=False,
        env_file=".app.env",
    )

    app_initial_superuser_email: str
    app_initial_superuser_password: str
    app_sender_email: str
    app_client_password: str
    app_host: str
    app_port: int
    postgres_port: int
    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_host_name: str

    @computed_field
    @property
    def postgres_url(self) -> str:
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.postgres_host_name}:{self.postgres_port}/{self.postgres_db}"


config = _Config(_env_file="../.app.env")
