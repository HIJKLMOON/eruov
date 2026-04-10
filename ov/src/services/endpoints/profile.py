from fastapi import APIRouter, Request

from dependencies.database import db_session_depend, redis_conn_depend

import models.Profile as profile_model
import schemas.profile as profile_schema

app = APIRouter(prefix="/profiles")


@app.get("/{id}/info")
async def get_profile_info(
    id: int,
    request: Request,
    session: db_session_depend,
    redis_conn: redis_conn_depend,
) -> dict:
    redis_conn.set("id", id, ex=10)
    # profile = profile_model.Profile(
    #     id=123456, name="John Doe", age=12, gender="male", like=100
    # )
    # session.add(profile)
    # await session.commit()
    # await session.refresh(profile)

    profile = await session.get(profile_model.Profile, id)

    if profile:
        profile_dict = profile_schema.ProfileInfoResponse.model_validate(
            profile
        ).model_dump()
        return {"code": 200, "data": profile_dict, "msg": "Success"}

    return {"code": 404, "data": None, "msg": "Profile not found"}


@app.post("/{id}/info")
async def post_profile_info(
    id: int,
    request: Request,
    session: db_session_depend,
):
    body = await request.json()

    profile = await session.get(profile_model.Profile, id)

    if not profile:
        return {"code": 404, "data": None, "msg": "Profile not found"}

    if "name" in body:
        profile.name = body["name"]
    if "age" in body:
        profile.age = body["age"]
    if "gender" in body:
        profile.gender = body["gender"]

    session.add(profile)
    await session.flush()
    await session.refresh(profile)
    await session.commit()

    profile_dict = profile_schema.ProfileInfoResponse.model_validate(
        profile
    ).model_dump()
    return {"code": 200, "data": profile_dict, "msg": "Update success"}
