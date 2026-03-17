from fastapi import APIRouter
import models.profiles as profile_model

app = APIRouter(prefix="/profiles")

@app.get("/info")
def get_profile_info() -> dict:
    test = {
        "code": 200,
        "data": profile_model.Profiles(name="John Doe", age=30, gender="male", like=100, id=1),
        "msg": "Success"
    }
    return test
