from fastapi import HTTPException, status
from sqlalchemy import select, update, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.Account import Account
import schemas.account as account_shcemas

from utils.password_hash import hash_password, verify_password


async def get_id_by_phone(phone: str, session: AsyncSession):
    """通过手机号搜索用户ID"""
    stmt = select(Account).where(Account.phone == phone)
    result = await session.execute(stmt)
    account = result.one_or_none()
    return account.id if account else None


async def register_account(
    register: account_shcemas.register_data, session: AsyncSession
):
    """注册账户"""
    if get_id_by_phone(register.phone, session):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="手机号已注册")
    hashed_password = (
        await hash_password(register.hashed_password) if register.hashed_password else None
    )
    account = Account(
        phone=register.phone,
        password_hash=hashed_password,
    )
    session.add(account)
    await session.flush()
    await session.refresh(account)


async def login_account(login: account_shcemas.login_data, session: AsyncSession):
    account_id = get_id_by_phone(login.phone, session)
    if account_id is None:
        raise HTTPException(
            status_code=status.HTTP_411_LENGTH_REQUIRED, detail="账号未注册"
        )
    if login.use_password and login.hashed_password:
        stmt = select(Account.password_hash).where(Account.id == account_id)
        result = await session.execute(stmt)
        value = result.one_or_none()
        if value is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="未设置密码"
            )
        verify_value = await verify_password(login.hashed_password, value[0])
        if verify_value:
            stmt = (
                update(Account)
                .where(Account.id == account_id)
                .values(
                    current_devices_msg=func.json_set(
                        Account.current_devices_msg,
                        f"$.{login.device_id}",
                        {
                            "device_name": login.device_name,
                            "device_type": login.device_type,
                            "last_active_time": login.login_time,
                            "remember_me": login.remember_me,
                        },
                    )
                )
            )
            login_result = session.execute(stmt)

    pass
