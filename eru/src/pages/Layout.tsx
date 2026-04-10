import { NavLink, Outlet } from "react-router-dom";
import AuthGuard from "../utils/AuthGuard";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2>导航</h2>
        <nav>
          <NavLink
            to="/counter"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            计数器
          </NavLink>
          <NavLink
            to="/api"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            API 请求
          </NavLink>
          <NavLink
            to="/storage"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            LocalStorage
          </NavLink>
          <NavLink
            to="/test"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            测试
          </NavLink>
          <NavLink
            to={"/account"}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            账户
          </NavLink>
        </nav>
      </aside>

      <main className={styles.content}>
        <Outlet />
        <AuthGuard />
      </main>
    </div>
  );
};

export default Layout;
