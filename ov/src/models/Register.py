from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from models.Base import Base


class Register(Base):
    __tablename__ = "register"

    id: Mapped[int | None] = mapped_column(Integer, primary_key=True)
    phone: Mapped[str] = mapped_column(String(11))
    password_hash: Mapped[str] = mapped_column(String(100))
