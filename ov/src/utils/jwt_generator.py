from datetime import datetime, timedelta

from jose import JWTError, jwt

from typing import Any

from core.config import settings

with open("src/core/fernet_key.key", 'r') as f:
    key = f.read()

def create_access_token(
    subject: dict[str, Any],
    expires_delta: timedelta | None,
):
    expire_time = (
        datetime.now() + expires_delta
        if expires_delta
        else datetime.now() + timedelta(minutes=settings.TOKEN_EXPIRE_MINUTES)
    )
    to_encode = {"exp": expire_time, "sub": subject}
    return jwt.encode(claims=to_encode, algorithm=settings.ALGORITHM, key=key)

def verify_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token=token, key=key, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise ValueError("token错误")
    except Exception:
        raise ValueError("token验证错误")
        