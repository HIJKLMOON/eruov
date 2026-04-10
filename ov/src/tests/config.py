import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 服务器配置
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 5055))
DEBUG = os.getenv("DEBUG", "False") == "True"

# API Key 配置（生产环境建议存储在数据库/密钥管理服务）
# 格式：{API Key 哈希: {过期时间, IP白名单, 备注, 权限}}
# 注意：生产环境需用 SHA256 哈希存储 Key，此处为演示简化
API_KEYS = {
    "sk_89a7b6543210fedc": {
        "expire_at": "2026-12-31 23:59:59",  # 过期时间
        "ip_whitelist": ["127.0.0.1", "192.168.1.0/24"],  # IP白名单（支持网段）
        "remark": "内部服务调用",
        "permissions": ["read", "write"]  # 接口权限
    },
    "sk_1234567890abcdef": {
        "expire_at": "2025-12-31 23:59:59",
        "ip_whitelist": ["127.0.0.1"],
        "remark": "测试环境",
        "permissions": ["read"]
    }
}

# 频率限制配置（每秒最多 5 次请求）
RATE_LIMIT = "5/second"

# 安全配置
ALLOWED_PROXIES = ["127.0.0.1"]  # 信任的代理 IP（用于获取真实客户端 IP）
REQUIRE_HTTPS = os.getenv("REQUIRE_HTTPS", "True") == "True"  # 生产环境强制 HTTPS
