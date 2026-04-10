from fastapi import FastAPI, Request, RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.middleware.sessions import SessionMiddleware  # 需会话存储临时数据

app = FastAPI(title="OAuth2 GitHub Demo")
# 1. 添加会话中间件（WSL 环境无需额外配置，确保 secret_key 随机）
app.add_middleware(SessionMiddleware, secret_key="your-random-secret-key-xxxx")

# 2. 初始化 OAuth 客户端（配置 GitHub 授权信息）
oauth = OAuth()
oauth.register(
    name="github",
    client_id="YOUR_GITHUB_CLIENT_ID",  # 替换为你的 Client ID
    client_secret="YOUR_GITHUB_CLIENT_SECRET",  # 替换为你的 Client Secret
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",  # GitHub 资源服务器基础地址
    client_kwargs={"scope": "user:email"},  # 请求的权限范围（获取用户邮箱）
)

# 3. 1 引导用户跳转到 GitHub 授权页


@app.get("/auth/github")
async def github_auth(request: Request):
    # 生成授权跳转 URL（redirect_uri 需与 GitHub 注册时一致）
    redirect_uri = "http://localhost:8000/auth/github/callback"  # WSL 用 localhost 或内网 IP
    return await oauth.github.authorize_redirect(request, redirect_uri)

# 3. 2 授权回调接口（接收 GitHub 返回的授权码，换令牌并获取用户信息）


@app.get("/auth/github/callback")
async def github_callback(request: Request):
    try:
        # 用授权码获取 access_token
        token = await oauth.github.authorize_access_token(request)
    except OAuthError as e:
        return {"error": e.error, "description": e.description}

    # 用 access_token 访问 GitHub 资源服务器（获取用户信息）
    github_api = oauth.github.api
    github_api.token = token  # 自动携带 access_token 到请求头
    user_info = await github_api.get("/user")  # 调用 GitHub /user 接口
    user_data = user_info.json()

    # 后续逻辑：登录态存储（如写入 Session）、用户数据入库等
    request.session["user"] = {
        "name": user_data["name"], "email": user_data.get("email")}
    return RedirectResponse(url="/profile")

# 4. 访问需要授权的资源（如用户个人主页）


@app.get("/profile")
async def profile(request: Request):
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/auth/github")  # 未登录则引导授权
    return {"message": "已授权访问", "user_info": user}

if __name__ == "__main__":
    import uvicorn
    # WSL 环境启动时，绑定 0.0.0.0 确保 Windows 可访问
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
