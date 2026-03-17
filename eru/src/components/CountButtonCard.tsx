import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";

interface CountButtonProps  {
    count: number,
    handleClick: (num: number) => void,
}

const CountButton = (props: CountButtonProps) => {
    const {count, handleClick} = props;
    useEffect(() => {}, [count]);
    return (
        <Fragment>
            <button className="btn" onClick={() => handleClick(count)} >
                {count} x 2 = {count * 2}
            </button>
        </Fragment>
    )
}

export default CountButton;