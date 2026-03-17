from dependencies.config import (
    HOST, PORT, DEBUG, API_KEYS, RATE_LIMIT,
    ALLOWED_PROXIES, REQUIRE_HTTPS
)
import re
import time
import logging
from datetime import datetime
from ipaddress import ip_address, ip_network
from typing import Optional, Dict, List

import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.security import APIKeyHeader, APIKeyQuery
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

# 配置日志（审计用）
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("apikey_auth.log"), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# 导入配置

# 初始化 FastAPI 应用
app = FastAPI(
    title="FastAPI API Key 认证（带 IP 校验）",
    description="实现 API Key 认证 + IP 白名单 + 频率限制 + 日志审计",
    version="1.0.0",
    debug=DEBUG
)

# 生产环境强制 HTTPS
if REQUIRE_HTTPS and not DEBUG:
    app.add_middleware(HTTPSRedirectMiddleware)

# 跨域配置（根据实际需求调整）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境替换为具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化频率限制器
limiter = Limiter(key_func=get_remote_address, default_limits=[RATE_LIMIT])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 1. 定义 API Key 提取器
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)  # 优先请求头
api_key_query = APIKeyQuery(name="api_key", auto_error=False)      # 备用查询参数


def get_client_real_ip(request: Request) -> str:
    """
    获取客户端真实 IP（兼容代理/反向代理场景）
    优先级：X-Real-IP > X-Forwarded-For > remote_addr
    """
    # 1. 从 X-Real-IP 头获取（常见于 Nginx 反向代理）
    real_ip = request.headers.get("X-Real-IP")
    if real_ip and is_valid_ip(real_ip):
        return real_ip

    # 2. 从 X-Forwarded-For 头获取（兼容多个代理）
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # X-Forwarded-For 格式：client_ip, proxy1_ip, proxy2_ip
        client_ip = forwarded_for.split(",")[0].strip()
        if is_valid_ip(client_ip):
            return client_ip

    # 3. 直接获取远程地址（去除端口）
    remote_addr = request.client.host if request.client else "unknown"
    return remote_addr


def is_valid_ip(ip: str) -> bool:
    """验证 IP 地址合法性"""
    try:
        ip_address(ip)
        return True
    except ValueError:
        return False


def is_ip_in_whitelist(client_ip: str, whitelist: List[str]) -> bool:
    """
    检查客户端 IP 是否在白名单中（支持单个 IP 和 CIDR 网段）
    示例：whitelist = ["127.0.0.1", "192.168.1.0/24"]
    """
    if not client_ip or not whitelist:
        return False

    try:
        client_ip_obj = ip_address(client_ip)
        for ip_rule in whitelist:
            if "/" in ip_rule:
                # 处理 CIDR 网段
                network = ip_network(ip_rule, strict=False)
                if client_ip_obj in network:
                    return True
            else:
                # 处理单个 IP
                if client_ip == ip_rule:
                    return True
        return False
    except ValueError:
        return False


def is_api_key_expired(expire_at: str) -> bool:
    """检查 API Key 是否过期"""
    try:
        expire_time = datetime.strptime(expire_at, "%Y-%m-%d %H:%M:%S")
        return datetime.now() > expire_time
    except (ValueError, TypeError):
        return False  # 无过期时间则视为永久有效


def verify_api_key(
    request: Request,
    header_api_key: Optional[str] = Depends(api_key_header),
    query_api_key: Optional[str] = Depends(api_key_query)
) -> Dict:
    """
    核心验证逻辑：
    1. 提取 API Key（优先请求头，备用查询参数）
    2. 获取客户端真实 IP
    3. 验证 Key 合法性、过期时间、IP 白名单
    4. 记录审计日志
    """
    # 1. 提取 API Key
    api_key = header_api_key or query_api_key
    client_ip = get_client_real_ip(request)
    auth_result = "failed"
    error_msg = ""

    # 2. 审计日志基础信息
    log_data = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "client_ip": client_ip,
        "api_key": api_key[:4] + "****" if api_key else "none",  # 脱敏
        "path": request.url.path,
        "method": request.method,
        "result": auth_result,
        "error_msg": error_msg
    }

    try:
        # 3. 验证 Key 是否存在
        if not api_key:
            error_msg = "API Key 未提供"
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="未检测到 API Key，请通过 X-API-Key 请求头或 api_key 查询参数携带"
            )

        # 4. 验证 Key 是否在合法列表中
        key_info = API_KEYS.get(api_key)
        if not key_info:
            error_msg = "API Key 不存在"
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="无效的 API Key"
            )

        # 5. 验证 Key 是否过期
        if is_api_key_expired(key_info["expire_at"]):
            error_msg = "API Key 已过期"
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="API Key 已过期，请联系管理员更换"
            )

        # 6. 验证 IP 是否在白名单
        if not is_ip_in_whitelist(client_ip, key_info["ip_whitelist"]):
            error_msg = f"IP {client_ip} 不在白名单中"
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="当前 IP 无访问权限，请联系管理员添加白名单"
            )

        # 7. 验证通过
        auth_result = "success"
        log_data["result"] = auth_result
        log_data["key_remark"] = key_info["remark"]

        # 返回 Key 详细信息（供接口使用）
        return {
            "api_key": api_key,
            "client_ip": client_ip,
            "permissions": key_info["permissions"],
            "remark": key_info["remark"]
        }

    except HTTPException:
        # 记录失败日志
        log_data["error_msg"] = error_msg
        logger.warning(f"API Key 认证失败: {log_data}")
        raise
    finally:
        # 记录所有请求日志
        if auth_result == "success":
            logger.info(f"API Key 认证成功: {log_data}")

# 2. 受保护的接口示例


@app.get("/api/protected", dependencies=[Depends(limiter.limit(RATE_LIMIT))])
def protected_api(
    request: Request,
    key_info: Dict = Depends(verify_api_key)
):
    """受保护的接口：需验证 API Key + IP 白名单 + 频率限制"""
    return {
        "status": "success",
        "message": "访问受保护接口成功",
        "data": {
            "client_ip": key_info["client_ip"],
            "api_key": key_info["api_key"][:4] + "****",  # 脱敏返回
            "permissions": key_info["permissions"],
            "remark": key_info["remark"],
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    }

# 3. 公开接口（仅用于测试 IP 获取）


@app.get("/api/public/ip")
def get_ip_info(request: Request):
    """公开接口：获取客户端真实 IP（用于测试）"""
    client_ip = get_client_real_ip(request)
    return {
        "status": "success",
        "data": {
            "client_real_ip": client_ip,
            "remote_addr": request.client.host if request.client else "unknown",
            "x_real_ip": request.headers.get("X-Real-IP", "none"),
            "x_forwarded_for": request.headers.get("X-Forwarded-For", "none")
        }
    }

# 4. 健康检查接口（无需认证）


@app.get("/health")
def health_check():
    """健康检查接口：无需认证"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


# 启动服务
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=DEBUG,
        log_level="info"
    )
