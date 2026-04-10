# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

# API 文档

## 基础配置

**Base URL**: `VITE_API_BASE_URL` (环境变量)  
**Content-Type**: `application/json;charset=utf-8`  
**Timeout**: 10000ms  
**认证方式**: Bearer Token (存储于 localStorage，自动附加到请求头)

### 请求拦截器
- 自动从 `localStorage` 读取 `token` 并附加 `Authorization: Bearer {token}` 头

### 响应拦截器
| 状态 | 行为 |
|------|------|
| 非 200 状态码 | 弹出 `message.error(response.statusText)` |
| 网络异常 | 弹出 `message.error("网络异常，请重试")` |
| 成功 (200) | 返回 `response.data` |

---

## 1. 登录模块 (Account / Login)

### 1.1 用户登录

| 属性 | 值 |
|------|-----|
| **Method** | `POST` |
| **Path** | `/api/login` |
| **Auth** | 不需要 |

**请求体 (LoginParams)**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | ✅ | 手机号 |
| usePassword | boolean | ✅ | 是否使用密码登录 |
| password | string | 条件必填 | 密码 (usePassword=true 时需要) |
| valid | string | 条件必填 | 验证码 (短信验证码登录时需要) |

**响应体 (LoginResponse)**:
| 字段 | 类型 | 说明 |
|------|------|------|
| access_token | string | 访问令牌 |
| token_type | string | 令牌类型 |

---

### 1.2 发送登录验证码

| 属性 | 值 |
|------|-----|
| **Method** | `POST` |
| **Path** | `/api/login/valid/send` |
| **Auth** | 不需要 |

**请求体**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | ✅ | 手机号 |

**响应**: `void`

---

## 2. 注册模块 (Account / Register)

### 2.1 发送注册验证码

| 属性 | 值 |
|------|-----|
| **Method** | `POST` |
| **Path** | `/api/register/valid/send` |
| **Auth** | 不需要 |

**请求体**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | ✅ | 手机号 |

**响应**: `void`

---

### 2.2 用户注册

| 属性 | 值 |
|------|-----|
| **Method** | `POST` |
| **Path** | `/api/register` |
| **Auth** | 不需要 |

**请求体 (RegisterParams)**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | ✅ | 手机号 |
| valid | string | ✅ | 验证码 |
| usePassword | boolean | ✅ | 是否设置密码 |
| password | string | 条件必填 | 密码 (usePassword=true 时发送前会被 SHA-256 哈希) |

**响应体 (RegisterResponse)**:
| 字段 | 类型 | 说明 |
|------|------|------|
| message | string | 响应消息 |

> **注意**: 密码在发送前通过 `hash_crypto` 工具进行 SHA-256 哈希处理。

---

## 3. 用户资料模块 (Profile)

### 3.1 获取用户资料

| 属性 | 值 |
|------|-----|
| **Method** | `GET` |
| **Path** | `/api/profiles/{id}/info` |
| **Auth** | 需要 Bearer Token |

**路径参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | ✅ | 用户ID |

**响应体**:
```typescript
{ data: ProfileInfo }
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 用户ID |
| name | string | 姓名 |
| age | number | 年龄 |
| gender | string | 性别 |
| avatarUrl | string | 头像URL |
| like | number | 点赞数 |
| update_time | string | 更新时间 |
| create_time | string | 创建时间 |
| is_delete | number | 删除标记 |

**客户端校验**:
- `id` 不能为空

---

### 3.2 更新用户资料

| 属性 | 值 |
|------|-----|
| **Method** | `POST` |
| **Path** | `/api/profiles/{id}/info` |
| **Auth** | 需要 Bearer Token |

**路径参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | ✅ | 用户ID |

**请求体**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | ✅ | 用户ID |
| name | string | ✅ | 姓名 |
| age | number | ✅ | 年龄 |
| gender | string | ✅ | 性别 |

**响应体**: `ProfileInfo` (同上)

**客户端校验**:
| 校验项 | 规则 |
|--------|------|
| id | 不能为空 |
| name | 不能为空字符串 |
| age | 1-120 之间 |
| gender | 必须是 `male` / `female` / `other` |

---

## 4. 旧版注册 (Profile Register) ⚠️

> 此文件 `profileRegister.ts` 似乎与 `account/register.ts` 功能重复，可能为旧版实现。

### 4.1 注册 (旧版)

| 属性 | 值 |
|------|-----|
| **Method** | `POST` |
| **Path** | `/api/register` |
| **Auth** | 不需要 |

**请求体 (registerValue)**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | ✅ | 手机号 |
| password | string | ✅ | 密码 |
| confirm_password | string | ✅ | 确认密码 |
| valid | string | ✅ | 验证码 |
| adult_status | boolean | ✅ | 成年状态 |
| gender | string | ✅ | 性别 |
| hobby | string[] | ✅ | 兴趣爱好列表 |

**响应体**: `registerValue` (返回提交的完整数据)

---

## API 端点汇总

| # | Method | Path | 模块 | 说明 |
|---|--------|------|------|------|
| 1 | POST | `/api/login` | 登录 | 用户登录，返回 token |
| 2 | POST | `/api/login/valid/send` | 登录 | 发送登录验证码 |
| 3 | POST | `/api/register/valid/send` | 注册 | 发送注册验证码 |
| 4 | POST | `/api/register` | 注册 | 用户注册 (新版) |
| 5 | GET | `/api/profiles/{id}/info` | 资料 | 获取用户资料 |
| 6 | POST | `/api/profiles/{id}/info` | 资料 | 更新用户资料 |

---

## ⚠️ 注意事项

1. **注册功能重复**: `account/register.ts` 和 `profile/profileRegister.ts` 都实现了 `/api/register` 端点，但请求体结构不同，建议确认哪个是活跃版本。
2. **密码哈希**: 新版注册使用客户端 SHA-256 哈希密码，旧版直接发送明文密码。
3. **错误处理**: 所有错误通过 Ant Design `message.error` 弹窗提示。
