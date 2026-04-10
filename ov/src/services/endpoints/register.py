from fastapi import APIRouter, Request, Response


from dependencies.database import db_session_depend

from models.Register import Register as register_model
from schemas.register import register as register_schema
from cruds.register import register_account

from utils.password_hash import hash_password

app = APIRouter(prefix="/register")


@app.post("")
async def register_user(
    request: register_schema,
    response: Response,
    session: db_session_depend,
):
    body = request.model_dump()
    register = register_model(
        phone=body["phone"], password_hash=await hash_password(body["password"])
    )
    await register_account(register=register, session=session)
    return register.id
