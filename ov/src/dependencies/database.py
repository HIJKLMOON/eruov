from typing import AsyncGenerator

from pydantic_settings import BaseSettings, SettingsConfigDict
import aiomysql
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

class Settings(BaseSettings):
    DATABASE_URL: str
    UPLOAD_DIR: str
    MAX_AVATAR_SIZE: int
    BASE_URL: str

    model_config = SettingsConfigDict(
        env_file="src/.env",
        env_file_encoding="utf-8"
    )

settings = Settings()

async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=1800
)

session_maker = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)
"""异步数据库会话工厂"""

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """异步数据库会话依赖"""
    async with session_maker() as session:
        async with session.begin():
            yield session
