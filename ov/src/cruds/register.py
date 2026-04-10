from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from sqlmodel import select

from models.Register import Register as register_model


async def phone_registered(phone: str, session: AsyncSession):
    stmt = select(register_model.phone).where(register_model.phone == phone)
    results = await session.execute(stmt)
    value = results.one_or_none()
    return True if value else False


async def register_account(register: register_model, session: AsyncSession):
    """将电话号码和密码哈希值存储到数据库"""
    if await phone_registered(register.phone, session):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="手机号已注册",
        )
    session.add(register)
    await session.flush()
    await session.refresh(register)
