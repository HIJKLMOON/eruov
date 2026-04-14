from sqlalchemy import String, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column

from models.Base import Base


class Account(Base):
    __tablename__ = "account"

    id: Mapped[int | None] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        unique=True,
        comment="ID",
    )

    phone: Mapped[str] = mapped_column(String(11), unique=True, comment="电话号码")

    password_hash: Mapped[str | None] = mapped_column(String(255), comment="密码哈希")

    current_devices_msg: Mapped[dict | None] = mapped_column(
        JSON,
        default=dict,
        comment="已登录设备列表",
        sort_order=996,
    )

    # current_devices_msg 示例：
    # {
    #   'device_id': {
    #     "device_name": "iPhone 15",
    #     "device_type": "iOS",
    #     "last_active_time": "2026-03-27T20:00:00",
    #     "remember_me": true
    #   }
    # }
