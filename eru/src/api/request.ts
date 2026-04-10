import axios from "axios";
import { message } from "antd";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      message.error(response.statusText || "请求失败");
      return Promise.reject(response);
    }
    return response.data;
  },
  (error) => {
    message.error(error.response.data.detail || "网络异常，请重试");
    return Promise.reject(error);
  },
);

export default request;
