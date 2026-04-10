import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  postRegisterValue,
  sendRegisterValidCode,
} from "../../api/account/register";
import { message } from "antd";
import "./RegisterForm.css";

interface RegisterFormData {
  phone: string;
  valid: string;
  usePassword: boolean,
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const navigate = useNavigate(); // 重定向工具
  const [loading, setLoading] = useState(false); // 注册状态
  const [countdown, setCountdown] = useState(0); // 验证码有效时间

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({ // 表单组件
    defaultValues: {
      phone: "",
      valid: "",
      usePassword: false,
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const password = watch("password"); // 监听密码
  const usePasswordWatch = watch("usePassword"); // 监听是否设置密码注册

  const handleSendValidCode = async () => { // 发送验证码事件处理函数
    const phone = watch("phone"); // 监听是否输入手机号的状态
    if (!phone) {
      message.error("请先输入手机号");
      return;
    }
    try {
      await sendRegisterValidCode(phone); // 调用发送验证码 API
      message.success("验证码已发送");
      setCountdown(60);
      const timer = setInterval(() => { // 验证码处理时间
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

  const onValid = async (data: RegisterFormData) => { // 验证成功处理函数
    if (usePasswordWatch) {
      if (!data.password) {
        message.error("请输入密码");
        return;
      }
      if (data.password !== data.confirmPassword) {
        message.error("两次输入的密码不一致");
        return;
      }
      if (data.password.length < 6) {
        message.error("密码至少6位");
        return;
      }
    }
    setLoading(true);
    try {
      await postRegisterValue({
        phone: data.phone,
        valid: data.valid,
        usePassword: data.usePassword,
        password: data.password
      });
      message.success("注册成功，请登录");
      navigate("/account/login");
    } catch(e) {
      message.error(`${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <h2>注册</h2>
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

          <div className="form-group password-toggle">
            <label className="password-toggle-label">设置密码</label>
            <div
              className={`password-switch ${usePasswordWatch ? "active" : ""}`}
              onClick={() => setValue('usePassword', !usePasswordWatch)}
            />
          </div>

          {usePasswordWatch && (
            <>
              <div className="form-group">
                <label htmlFor="password">密码</label>
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  placeholder="请输入密码"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">确认密码</label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    validate: (value) =>
                      !usePasswordWatch || value === password || "两次密码不一致",
                  })}
                  placeholder="请再次输入密码"
                  onFocus={() => {
                    if (!password) {
                      message.warning("请先输入密码");
                      document.getElementById("password")?.focus();
                    }
                  }}
                />
                {errors.confirmPassword && (
                  <span className="error">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "注册中..." : "注册"}
          </button>

          <div className="login-link">
            已有账号？<a onClick={() => navigate("/account/login")}>立即登录</a>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default RegisterForm;
