import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Outlet,
} from "react-router-dom";
import Counter from "./pages/Counter";
import "./App.css";
import Api from "./pages/Api";
import StorageManager from "./pages/StorageManager";
import Test from "./pages/Test";

const App = () => {
  // const
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="layout">
              <aside className="sidebar">
                <h2>导航</h2>
                <nav>
                  <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    计数器
                  </NavLink>
                  <NavLink
                    to="/api"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    API 请求
                  </NavLink>
                  <NavLink
                    to="/storage"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    LocalStorage
                  </NavLink>
                  <NavLink
                    to="/test"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    测试
                  </NavLink>
                </nav>
              </aside>
              <main className="content">
                <Outlet />
              </main>
            </div>
          }
        >
          <Route index element={<Counter />} />
          <Route path="api" element={<Api />} />
          <Route path="storage" element={<StorageManager />} />
          <Route path="test" element={<Test />} />
          <Route path="*" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
