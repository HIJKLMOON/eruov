import request from "../request";

export interface LoginParams { // 请求体格式
  phone: string;
  usePassword: boolean;
  password?: string;
  valid?: string;
}

export interface LoginResponse { // 响应体格式
  access_token: string;
  token_type: string;
}

const postLogin = async (params: LoginParams): Promise<LoginResponse> => { // 登录请求
  const data = {
    phone: params.phone,
    password: params.password || "",
    valid: params.valid || "",
    usePassword: params.usePassword,
  };
  return await request.post("api/account/login", data);
};

const sendValidCode = async (phone: string): Promise<void> => { // 请求验证码
  return await request.post("api/account/login/valid/send", { phone });
};

export { postLogin, sendValidCode };
