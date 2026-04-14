import json
import random
import secrets

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from dependencies.cache_penetration import cache_penetration_guard_depend
from dependencies.database import db_session_depend, redis_conn_depend

import schemas.account as account_schema
import cruds.account as account_crud

app = APIRouter(prefix="/account")


@app.post("/register")
async def register_account(
    register_data: account_schema.register_data,
    request: Request,
    response: Response,
    session: db_session_depend,
    redis_conn: redis_conn_depend,
    cache_penetration: cache_penetration_guard_depend,
):

    # {'phone': '13547594583', 'valid': '1234', 'use_password': False, 'hashed_password': None, 'device_id': '3cb66939-a7ba-4667-8636-d84a50d21111', 'device_name': 'Windows PC', 'device_type': 'Windows'}

    # 判断手机号是否注册
    user_id = account_crud.get_id_by_phone(register_data.phone, session)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="账号未注册"
        )

    # 从 Redis 数据库拉取手机号和验证码，并验证
    valid_key = "valid:verify"
    valid_value_key = f"{valid_key}:{register_data.phone}"
    valid_value = redis_conn.hget(valid_key, valid_value_key)
    if valid_value is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="请先申请验证码"
        )

    if valid_value != register_data:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="验证码错误")

    

    # 对 schema 密码进行 hash 加密

    # 将 schema 转 model

    return None


@app.post("/register/valid/send")
async def send_valid(
    phone: account_schema.post_phone,
    redis_conn: redis_conn_depend,
):
    valid_key = "valid:verify"
    valid_value_key = f"{valid_key}:{phone.phone}"
    valid_frequency_key = f"frequency:{valid_key}:{phone.phone}"

    valid_frequency = redis_conn.hget(valid_key, valid_frequency_key)

    redis_conn.hset(
        valid_key,
        valid_frequency_key,
        (1 if valid_frequency is None else int(valid_frequency) + 1),  # type: ignore
    )

    redis_conn.hexpire(valid_key, 86_400, valid_frequency_key, nx=True)

    if (valid_frequency) > 5:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="超过验证码申请次数，请24小时后再试",
        )

    # valid_value = f"{random.randint(0, 999_999):06d}"
    # valid_value = "".join(random.choices('0_123_456_789', k=6))
    valid_value = f"{secrets.randbelow(1_000_000):06d}"
    print(f"valid value: {valid_value}")
    redis_conn.hset(
        valid_key,
        valid_value_key,
        valid_value,
    )
    redis_conn.hexpire(valid_key, 60, valid_value_key)
    # 发送 valid 短信到 phone

    return True
