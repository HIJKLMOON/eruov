from fastapi import APIRouter
from .endpoints.profile import app as profile_router

app = APIRouter(prefix="/api")

app.include_router(profile_router, tags=["用户资料"])
