from datetime import datetime

from sqlalchemy import Boolean, DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    __abstract__ = True

    update_time: Mapped[datetime] = mapped_column(
        DateTime,
        default=func.now(),
        onupdate=func.now(),
        comment="更新时间",
        sort_order=997,
    )

    create_time: Mapped[datetime] = mapped_column(
        DateTime,
        default=func.now(),
        comment="创建时间",
        sort_order=998,  # 字段排序（可选）
    )

    is_delete: Mapped[bool] = mapped_column(
        Boolean, default=False, comment="软删除标记", sort_order=999
    )
    # __table_args__ = {
    #     "mysql_engine": "InnoDB",  # 存储引擎
    #     "mysql_charset": "utf8mb4",  # 字符集
    #     "mysql_collate": "utf8mb4_unicode_ci",
    # }
    pass
