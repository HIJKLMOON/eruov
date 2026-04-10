import type { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime"
import styles from "./ButtonUp.module.css"

interface ButtonUpProps {
    children: ReactNode;
    handleClick: () => void;
}

const ButtonUp = (props: ButtonUpProps) => {
    return (
        <Fragment>
            <button className={styles.buttonUp} onClick={props.handleClick}>{props.children}</button>
        </Fragment>
    )
}

export default ButtonUp;