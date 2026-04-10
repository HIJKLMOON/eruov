import { BrowserRouter, Routes, Route } from "react-router-dom";
import Counter from "./pages/counter/Counter";
import "./App.css";
import Api from "./pages/api/Api";
import StorageManager from "./pages/storage/StorageManager";
import Test from "./pages/test/Test";
import Main from "./pages/main/Main";
import Layout from "./pages/Layout";
import Profile from "./pages/account/Profile";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="counter" element={<Counter />} />
          <Route path="api" element={<Api />} />
          <Route path="storage" element={<StorageManager />} />
          <Route path="test" element={<Test />} />
          <Route path="account" element={<Profile />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="*" element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
