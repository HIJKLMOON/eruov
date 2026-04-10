from typing import Annotated

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies.cache_penetration import cache_penetration_guard_depend
from dependencies.database import db_session_depend, redis_conn_depend

import schemas.account as account_schema
import cruds.account as account_crud

app = APIRouter(prefix="/account")


@app.post("/register")
async def register_account(
    register: account_schema.register_data,
    request: Request,
    response: Response,
    session: db_session_depend,
    redis_conn=redis_conn_depend,
):

    # {'phone': '13547594583', 'valid': '1234', 'use_password': False, 'hashed_password': None, 'device_id': '3cb66939-a7ba-4667-8636-d84a50d21111', 'device_name': 'Windows PC', 'device_type': 'Windows'}

    # 判断手机号是否注册

    # 从 Redis 数据库拉取手机号和验证码，并验证

    #

    # 对 schema 密码进行 hash 加密

    #

    # 将 schema 转 model

    #
    return None


@app.post("/register/valid/send")
async def send_valid(
    phone: account_schema.post_phone,
    response: Response,
    redis_conn: redis_conn_depend,
    cache_penetration_guard: cache_penetration_guard_depend,
):
    # valid 键名：valid:verify:{phone}
    valid_key = f'valid:verify:{phone}'

    # 查看 phone 规定时间段允许发送 valid 次数是否超过 5 次
    # 先判断 valid_key 是否存在
    
    # 判断次数是否小于 5
    if redis_conn.exists(valid_key) is None:
        pass

    # 生成 phone 对应的 valid，过期时间 60s

    # 发送 valid 短信到 phone

    pass
