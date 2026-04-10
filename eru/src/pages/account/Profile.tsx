import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ProfileBlock } from "../../components/account/ProfileBlock";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ["/account/login", "/account/register"]; // 当前路由中，无 Token 状态下允许的子路由白名单
    if (publicPaths.includes(location.pathname)) {
      return; // 在子路由白名单中时，不重定向，取消副作用
    }
    const token = localStorage.getItem("token"); // 获取 Token
    if (!token) {
      navigate("/account/login"); // Token 不存在则重定向
    }
  }, [navigate, location]);

  const token = localStorage.getItem("token");
  return token ? (
    <div>
      <h1>Profile</h1>
      <ProfileBlock />
    </div>
  ) : (
    <Outlet />
  );
};

export default Profile;
