import pathlib
from typing import ClassVar, Literal

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class _Config(BaseSettings):
    model_config = SettingsConfigDict(
        env_ignore_empty=True,
        extra="ignore",
        case_sensitive=False,
        env_file=".app.env",
        env_file_encoding="utf-8",
    )
    api_version: ClassVar = "v1"
    project_name: str = "Journal-CMS"
    app_site_domain: str = "Journal-CMS"
    app_jwt_secret: str
    app_cookie_age_seconds: int
    app_initial_superuser_email: str
    app_initial_superuser_password: str
    sender_email: str
    client_email_password: str
    app_internal_exception_timezone_view: str = "Europe/Kyiv"
    app_is_notifiable_internal_exception: bool
    app_port: int
    postgres_port: int
    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_host_name: str
    monobank_pub_key: str
    redis_host_name: str
    redis_port: int
    redis_password: str

    @computed_field
    @property
    def postgres_url(self) -> str:
        if self._launch_option == "local":
            self.postgres_host_name = "localhost"

        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.postgres_host_name}:{self.postgres_port}/{self.postgres_db}"

    def redis_url(self, db: int) -> str:
        if self._launch_option == "local":
            self.redis_host_name = "localhost"

        return f"redis://:{self.redis_password}@{self.redis_host_name}:{self.redis_port}/{db}"


_env_file = pathlib.Path(__file__).parent.parent.joinpath(".app.env").absolute()
config = _Config(_env_file=_env_file)
