import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import os from "os";
import path from "path";

function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
// 1. 通过 os.networkInterfaces() 扫描本机所有网卡
// 2. 取第一个非回环的 IPv4 地址（即局域网 IP）
// 3. 自动设置 VITE_API_BASE_URL 为 http://{IP}:4234

process.env.VITE_API_BASE_URL = `http://${getLocalIP()}:4234`;

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 4242,
    open: false,
    strictPort: true,
  },
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "/src"),
  //   },
  // },
});
