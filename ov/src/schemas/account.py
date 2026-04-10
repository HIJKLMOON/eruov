from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class register_data(BaseModel):
    phone: str = Field(min_length=11, max_length=11, pattern=r"^1[3-9]\d{9}$")

    valid: str | None

    use_password: bool

    hashed_password: str | None = Field(default=None, validation_alias="password")

    device_id: str

    device_name: str

    device_type: str

    model_config = ConfigDict(
        alias_generator=lambda s: "".join(
            word.capitalize() if i else word for i, word in enumerate(s.split("_"))
        ),
        populate_by_name=True,
    )


class login_data(register_data):
    remember_me: bool = Field(default=False)

    login_time: datetime


class post_phone(BaseModel):
    model_config = ConfigDict(
        alias_generator=lambda s: "".join(
            word.capitalize() if i else word for i, word in enumerate(s.split("_"))
        ),
        populate_by_name=True,
    )
    phone: str = Field(min_length=11, max_length=11, pattern=r"^1[3-9]\d{9}$")


class set_password(BaseModel):
    model_config = ConfigDict(
        alias_generator=lambda s: "".join(
            word.capitalize() if i else word for i, word in enumerate(s.split("_"))
        ),
        populate_by_name=True,
    )
    origin_password: str | None
    new_password: str
    valid: str
