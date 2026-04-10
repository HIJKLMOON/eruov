from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import ConfigDict, Field
from sqlmodel import default


class AppSettings(BaseSettings):
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://root:mysql@localhost:5432/star"
    )
    MAX_AVATAR_SIZE: int = Field(default=5242880)
    BASE_URL: str = Field(default="http://0.0.0.0:4234")
    UPLOAD_DIR: str = Field(default="./uploads/avatars")

    HOST: str = Field(default="0.0.0.0")
    PORT: str = Field(default="4234")
    DEBUG_STATUS: bool = Field(default=True)

    TOKEN_EXPIRE_MINUTES: int = Field(default=15)

    ALGORITHM: str = Field(default="RS256")

    model_config = SettingsConfigDict(
        env_file="src/.env",
        env_file_encoding="utf-8",
        env_prefix="MY_APP_",
        extra="ignore",
    )


settings = AppSettings()
