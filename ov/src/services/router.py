from fastapi import APIRouter
from services.endpoints.profile import app as profile_router
from services.endpoints.register import app as register_router
from services.endpoints.account import app as account_router
app = APIRouter(prefix="/api")

app.include_router(profile_router, tags=["用户资料"])
app.include_router(register_router, tags=["注册账户"])
app.include_router(account_router, tags=["账户登录注册"])
