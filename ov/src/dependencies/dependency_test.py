import datetime
from typing import Annotated

from fastapi import Depends

class num:
    def __init__(self) -> None:
        time = datetime.datetime.now()
        print(f'{time} 啊飒飒飒飒飒飒飒飒飒飒')
        pass

n = num()

def a():
    time = datetime.datetime.now()
    print(n)
    print(f"{time}调用了 a 一次\t")

# a_depends = Annotated[None, Depends(a)]