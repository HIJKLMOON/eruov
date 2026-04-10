import { useState } from "react";
import styles from "./CountCard.module.css";
import ButtonUp from "../base/ButtonUp";
import CountTimer from "./CountTimer";
import ButtonGlass from "../base/ButtonGlass";

const Countplus = () => {
  const [count, setCount] = useState(0);
  const [isShow, setIsShow] = useState(false);

  const decrementCount = () => {
    setCount((c) => c - 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  const incrementCount = () => {
    setCount((c) => c + 1);
  };

  return (
    <div className="page-card">
      <h1>计数器</h1>
      <strong>CountCard</strong>
      <h2>{count}</h2>
      <div className={styles.btnGroup}>
        <ButtonUp handleClick={decrementCount}>{count}--</ButtonUp>
        <ButtonUp handleClick={resetCount}>重置</ButtonUp>
        <ButtonUp handleClick={incrementCount}>{count}++</ButtonUp>
      </div>
      <ButtonGlass handleClick={() => setIsShow(!isShow)}>
        {isShow ? "卸载定时器" : "挂载定时器"}
      </ButtonGlass>
      {isShow && <CountTimer />}
    </div>
  );
};

export default Countplus;
