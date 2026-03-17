from contextlib import asynccontextmanager
import json
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

import dependencies.database as database
import services.router as router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with database.async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield

app = FastAPI(
    title="用户资料",
    description="用户资料接口",
    version="1.0.0",
    debug=True,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4242", "http://0.0.0.0:4242"],  # 允许前端域名
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有请求头
)


app.include_router(router=router.app, tags=["路由接口"])

def main():
    import uvicorn
    uvicorn.run(
        app="main:app",
        host="0.0.0.0",
        port=4234,
        reload=True,
        reload_dirs=["."],
        log_level="info"
    )

if __name__ == "__main__":
    main()