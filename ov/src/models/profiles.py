from typing import Optional
from sqlmodel import SQLModel, Field

class Profiles(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int
    gender: str
    like: int = 0
    avatarUrl: Optional[str] = None
    
    