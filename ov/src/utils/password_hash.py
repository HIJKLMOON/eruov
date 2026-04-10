import asyncio

from pwdlib import PasswordHash

ph = PasswordHash.recommended()
"""密码哈希对象"""


async def hash_password(password: str):
    """异步密码哈希加密"""
    return await asyncio.to_thread(ph.hash, password=password)


async def verify_password(input_password: str, hashed_password: str):
    """异步密码哈希验证"""
    return await asyncio.to_thread(
        ph.verify, password=input_password, hash=hashed_password
    )


if __name__ == "__main__":

    async def main():
        pw = "asdfasf"
        hashed_pw = await hash_password(pw)
        print(hashed_pw)
        print(await verify_password(hashed_password=hashed_pw, input_password=pw))

    asyncio.run(main())
