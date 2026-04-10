from models.Base import Base

from sqlalchemy.orm import Mapped, mapped_column

from sqlalchemy import String


class User(Base):
    __tablename__ = "user"

    account: Mapped[str] = mapped_column(
        String(50), nullable=False, unique=True, comment="可自定义账号"
    )

    nickname: Mapped[str | None] = mapped_column(
        String(50), nullable=True, comment="昵称"
    )

    email: Mapped[str | None] = mapped_column(
        String(100), nullable=True, unique=True, comment="邮箱"
    )
