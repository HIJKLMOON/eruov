import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { postLogin, sendValidCode } from "../../api/account/login";
import { message } from "antd";
import "./LoginForm.css";

interface LoginFormData {
  phone: string;
  usePassword: boolean;
  password?: string;
  valid?: string;
}

const LoginForm = () => {
  const navigate = useNavigate();  // 重定向函数工具
  const [loading, setLoading] = useState(false); // 登录加载状态
  const [countdown, setCountdown] = useState(0); // 验证码请求时间状态
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({ //表单 HOOK
    defaultValues: {
      phone: "",
      usePassword: true,
      password: "",
      valid: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const usePassword = watch("usePassword"); // 验证账号的方式

  const handleSendValidCode = async () => { // 发送验证码事件处理函数
    const phone = watch("phone"); // 手机号
    if (!phone) { // 未输入手机号
      message.error("请先输入手机号");
      return;
    }
    try {
      await sendValidCode(phone); // 请求验证码
      message.success("验证码已发送");
      setCountdown(60); // 验证码有效时间
      const timer = setInterval(() => { // 确保有效时间内未输入验证码需重新请求验证码
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      message.error("发送验证码失败");
    }
  };

  const onValid = async (data: LoginFormData) => { // 数据验证成功后的副作用
    setLoading(true); // 正在登陆
    try {
      const res = await postLogin(data); //发送登录请求
      localStorage.setItem("token", res.access_token); // 存储 Token
      message.success("登录成功");
      navigate("/"); // 重定向到主界面
    } catch {
      message.error("登录失败，请检查账号密码");
    } finally {
      setLoading(false); // 登录结果已返回
    }
  };

  return (
    <div className="login-form-container">
      <h2>登录</h2>
      <form onSubmit={handleSubmit(onValid)}>
        <fieldset>
          <div className="form-group">
            <label htmlFor="phone">手机号</label>
            <input
              type="text"
              id="phone"
              {...register("phone", { required: "请输入手机号" })}
              placeholder="请输入手机号"
            />
            {errors.phone && (
              <span className="error">{errors.phone.message}</span>
            )}
          </div>

          {usePassword ? (
            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                {...register("password", { required: "请输入密码" })}
                placeholder="请输入密码"
              />
              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="valid">验证码</label>
              <div className="valid-input">
                <input
                  type="text"
                  id="valid"
                  {...register("valid", { required: "请输入验证码" })}
                  placeholder="请输入验证码"
                />
                <button
                  type="button"
                  onClick={handleSendValidCode}
                  disabled={countdown > 0}
                  className="send-code-btn"
                >
                  {countdown > 0 ? `${countdown}s` : "获取验证码"}
                </button>
              </div>
              {errors.valid && (
                <span className="error">{errors.valid.message}</span>
              )}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </button>

          <button
            type="button"
            onClick={() => setValue("usePassword", !usePassword)}
            className="switch-btn"
          >
            {usePassword ? "使用验证码登录" : "使用密码登录"}
          </button>

          <div className="register-link">
            还没有账号？
            <a onClick={() => navigate("/account/register")}>立即注册</a>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default LoginForm;
