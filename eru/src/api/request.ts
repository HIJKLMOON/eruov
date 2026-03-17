import axios from "axios";
import { message } from "antd"; // 示例：UI库的提示组件，可替换为自己的提示逻辑

// 创建axios实例，配置公共参数
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量取接口前缀（最佳实践）
  timeout: 10000, // 超时时间
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器：统一添加token、处理请求前逻辑
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 从本地存储取token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 统一添加token请求头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器：统一处理错误、格式化响应数据
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      // 非成功状态统一提示
      message.error(res.msg || "请求失败");
      return Promise.reject(res);
    }
    return res.data; // 只返回核心数据，组件中直接用
  },
  (error) => {
    // 网络错误/超时等统一处理
    message.error(error.message || "网络异常，请重试");
    return Promise.reject(error);
  },
);

export default request;
