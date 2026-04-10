import type { ReactNode } from "react";
import styles from "./ButtonGlass.module.css";

interface buttonGlassInterface {
  children: ReactNode;
  handleClick?: () => void ;
  disabled?: boolean;
}

const ButtonGlass = (props: buttonGlassInterface) => {
  const { children, handleClick, disabled = false } = props;
  return (
    <button className={styles.bgBtn} onClick={handleClick} disabled={disabled}>
      <p>{children}</p>
    </button>
  );
};

export default ButtonGlass;
