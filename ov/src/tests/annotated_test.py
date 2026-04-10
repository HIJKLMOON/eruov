# def inside_func(request):
#     print(f'request: {request}')
#     return request * 5

# def outside_func(func):
#     print(f"get a func var: {func}")
#     return func

from typing import Annotated, get_type_hints, Callable


# ======================
# 第一步：自定义元数据类（模仿 FastAPI 的 Query、Depends）
# 作用：把「校验规则/依赖函数」打包成对象，存入 Annotated
# ======================
class MyQuery:
    """模仿 FastAPI Query：存储参数校验规则"""

    def __init__(
        self,
        min_length: int | None = None,
        max_length: int | None = None,
        gt: int | None = None,
    ):
        self.min_length = min_length
        self.max_length = max_length
        self.gt = gt  # 大于


class MyDepends:
    """模仿 FastAPI Depends：存储依赖函数"""

    def __init__(self, dependency: Callable):
        self.dependency = dependency  # 保存依赖函数，不执行！


# ======================
# 第二步：定义业务依赖函数（真正的业务逻辑）
# 这些函数不会自动执行，仅被 MyDepends 保存
# ======================
def get_token():
    """模拟获取用户Token"""
    print("🔗 执行依赖：获取用户Token")
    return "user_token_123456"


def get_db():
    """模拟获取数据库连接"""
    print("🔗 执行依赖：建立数据库连接")
    return "db_connection"


# ======================
# 第三步：用 Annotated 标注函数参数（核心用法）
# 1. MyQuery() / MyDepends()：定义时立即执行，生成对象存入元数据
# 2. 依赖函数（get_token）：仅保存，不执行
# ======================
def login(
    # 用户名：字符串 + 校验规则（长度3-20）
    username: Annotated[str, MyQuery(min_length=3, max_length=20)],
    # Token：字符串 + 依赖注入
    token: Annotated[str, MyDepends(get_token)],
    # 数据库：字符串 + 依赖注入
    db: Annotated[str, MyDepends(get_db)],
    # 年龄：数字 + 校验规则（大于0）
    age: Annotated[int, MyQuery(gt=0)],
):
    """模拟登录接口"""
    print(
        f"✅ 登录成功：username={username}, token={token[:5]}..., db={db[:5]}..., age={age}"
    )


# ======================
# 第四步：手写「极简框架核心」→ 解析 Annotated 元数据，执行依赖+校验
# 这就是 FastAPI 底层做的事情！
# ======================
def execute_func(func: Callable, **kwargs):
    """
    执行函数：
    1. 解析 Annotated 元数据
    2. 自动注入依赖
    3. 自动校验参数
    """
    # 关键：include_extras=True 才能拿到 Annotated 的元数据
    hints = get_type_hints(func, include_extras=True)
    for key, value in hints.items():
        print(f"hints key:{key}\t\tvalue:{value}")

    print()
    final_kwargs = {}

    # 遍历函数的每个参数
    for param_name, param_type in hints.items():
        # 1. 判断是否是 Annotated 类型
        if hasattr(param_type, "__metadata__"):
            # 提取：基础类型 + 元数据列表
            base_type = param_type.__args__[0]
            print(f"base_type value: {base_type}\n")
            metadatas = param_type.__metadata__
            print(f"metadatas value: {metadatas}\n")

            # 2. 遍历元数据（MyQuery / MyDepends）
            for meta in metadatas:
                # --- 处理依赖注入 MyDepends ---
                if isinstance(meta, MyDepends):
                    print(f"📦 注入依赖：{meta.dependency.__name__}\n")
                    # 框架主动执行依赖函数！
                    final_kwargs[param_name] = meta.dependency()

                # --- 处理参数校验 MyQuery ---
                if isinstance(meta, MyQuery):
                    # 拿到用户传入的参数值
                    value = kwargs[param_name]
                    print(f"🔍 校验参数：{param_name}={value}\n")

                    # 执行校验逻辑
                    if meta.min_length and len(str(value)) < meta.min_length:
                        raise ValueError(f"{param_name} 长度不能小于 {meta.min_length}")
                    if meta.gt and value <= meta.gt:
                        raise ValueError(f"{param_name} 必须大于 {meta.gt}")

                    final_kwargs[param_name] = value

        # 普通参数，直接赋值
        else:
            final_kwargs[param_name] = kwargs[param_name]

    # 3. 执行原函数
    print("-" * 50)
    func(**final_kwargs)


# ======================
# 第五步：测试运行！
# ======================
if __name__ == "__main__":
    # 正常调用
    execute_func(login, username="zhangsan", age=20)

    # 测试异常：年龄=0（校验失败）
    # execute_func(
    #     login,
    #     username="zhangsan",
    #     age=0
    # )
