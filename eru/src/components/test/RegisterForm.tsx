import { useForm } from "react-hook-form";

import ButtonGlass from "../base/ButtonGlass";
import { type registerValue, postRegisterValue } from "../../api/profile/profileRegister";
import { useState } from "react";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    control,
    formState: { errors, isSubmitting, dirtyFields, touchedFields, isValid },
  } = useForm<registerValue>({
    defaultValues: {
      phone: "",
      password: "",
      confirm_password: "",
      valid: "",
    },
    mode: "onSubmit",
    criteriaMode: "all",
    reValidateMode: "onSubmit",
    shouldUnregister: true,
  });

  const [verifyByPassword, setVerifyByPassword] = useState(true);

  const onValid = async (data: registerValue) => {
    await postRegisterValue(data);
    reset();
  };

  return (
    <form
      action=""
      className="page-card"
      onSubmit={handleSubmit(onValid)}
    >
      <fieldset>
        <legend>Login</legend>
        <div>
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            {...register("phone", {
              required: "手机号不能为空",
              pattern: {
                value: /^1[3-9]\d{9}$/,
                message: "请输入有效号码",
              },
            })}
          />
          <p>手机号码：{watch("phone") || "输入值"}</p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "密码不能为空",
            })}
          />
        </div>
        <div>
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            id="confirm_password"
            // disabled={!watch("password")}
            onFocus={() => {
              if (!watch("password")) {
                document.getElementById("password")?.focus();
              }
            }}
            {...register("confirm_password", {
              required: "请再次输入密码",
              validate: (value) =>
                !watch("password")
                  ? "请先输入密码"
                  : value === watch("password") || "两次密码输入不一致",
            })}
          />
        </div>
        <div>
          <label htmlFor="valid">Valid</label>
          <input
            type="text"
            id="valid"
            {...register("valid", {
              required: "验证码不能为空",
            })}
          />
        </div>
        <ButtonGlass
          disabled={isSubmitting}
          // handleClick={handleSubmit(onValid, onInvalid)}
        >
          {isSubmitting ? "提交中..." : "注册"}
        </ButtonGlass>
      </fieldset>
    </form>
  );
};

export default RegisterForm;
