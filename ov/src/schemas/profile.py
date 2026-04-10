from pydantic import BaseModel, ConfigDict
from typing import Optional


class ProfileInfoResponse(BaseModel):
    id: Optional[int] = None
    name: str
    age: int
    gender: str
    like: int = 0
    avatarUrl: Optional[str] = None
    
    model_config = ConfigDict(
        extra='ignore',
        from_attributes=True
    )
