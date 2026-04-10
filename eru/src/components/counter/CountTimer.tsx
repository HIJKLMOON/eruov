import { useState, useEffect } from "react";

const CountTimer = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 挂载时启动定时器
    const timer = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    // ✅ 返回清理函数：卸载前清除定时器
    return () => {
      clearInterval(timer);
      console.log(`定时器已清理，挂载时间${count}`);
    };
  }, []); // 空依赖，仅挂载执行一次

  return <div>计时：{count} 秒</div>;
}

export default CountTimer;

