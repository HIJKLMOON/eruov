from typing import Annotated, AsyncGenerator
from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from redis import Redis

import asyncmy
import asyncpg
from core.config import settings

# 数据库连接管理
async_engine = create_async_engine(
    settings.DATABASE_URL, echo=False, pool_size=10, max_overflow=20, pool_recycle=1800
)

session_maker = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)
"""异步数据库会话工厂"""


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """异步数据库会话依赖"""
    async with session_maker() as session:
        async with session.begin():
            yield session


db_session_depend = Annotated[AsyncSession, Depends(get_db_session)]
"""获取数据库会话的注解"""


# redis 连接管理
class RedisConn:
    def __init__(self, password: str = "redis"):
        self.conn = Redis(password=password, decode_responses=True)

    def get_conn(self) -> Redis:
        if self.conn is None:
            raise RuntimeError("Redis not initialized. Call init_redis() in lifespan.")
        return self.conn

    def close_conn(self):
        if self.conn is not None:
            self.conn.close()


def get_redis_conn(request: Request) -> Redis:
    """依赖函数：获取 redis 连接实例"""
    return request.app.state.redis_conn.get_conn()


redis_conn_depend = Annotated[Redis, Depends(get_redis_conn)]
"""获取 redis 连接实例的类型注解"""
