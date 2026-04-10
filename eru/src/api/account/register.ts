import hash_crypto from "../../utils/hash_crypto";
import { getDeviceInfo } from "../../utils/device";
import request from "../request";

export interface RegisterParams {
  // 注册请求体格式
  phone: string;
  valid: string;
  usePassword: boolean;
  password?: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
}

export interface RegisterResponse {
  //响应体格式
  message: string;
}

export const sendRegisterValidCode = async (phone: string): Promise<void> => {
  return await request.post("api/account/register/valid/send", { phone }); // 发送验证码请求
}; 

export const postRegisterValue = async (
  params: RegisterParams,
): Promise<RegisterResponse> => {
  // 发送注册请求体
  let password: string | undefined;

  if (params.usePassword && params.password) {
    password = await hash_crypto(params.password);
  }

  const deviceInfo = getDeviceInfo();

  return await request.post("api/account/register", {
    ...params,
    password: password,
    ...deviceInfo,
  });
};
