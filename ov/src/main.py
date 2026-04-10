from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dependencies import database
from dependencies.cache_penetration import CachePenetrationGuard

from models.Base import Base
import services.router as router
from utils.key_generator import fernet_key_generator


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with database.async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    fernet_key_generator()

    redis_conn = database.RedisConn("redis")
    app.state.redis_conn = redis_conn

    cache_penetration_guard = CachePenetrationGuard(app.state.redis_conn.get_conn())
    app.state.cache_penetration_guard = cache_penetration_guard

    yield

    redis_conn.close_conn()


app = FastAPI(
    title="用户资料",
    description="用户资料接口",
    version="1.0.0",
    debug=True,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4242",
        "http://0.0.0.0:4242",
        "http://10.49.47.156:4242",
        # "http://10.49.47.181:4242",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router=router.app, tags=["路由接口"])


def main():
    import uvicorn
    from core.config import settings

    uvicorn.run(
        app="main:app",
        host=settings.HOST,
        port=4234,
        reload=True,
        reload_dirs=["."],
        log_level="info",
    )


if __name__ == "__main__":
    main()
