from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from models.Base import Base


class Profile(Base):
    __tablename__ = "profile"

    id: Mapped[int | None] = mapped_column(Integer, default=None, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), default="", unique=True)
    age: Mapped[int] = mapped_column(Integer)
    gender: Mapped[str] = mapped_column(String(20))
    like: Mapped[int] = mapped_column(Integer, default=0)
    avatarUrl: Mapped[str | None] = mapped_column(String(100), default=None)
