import type { ReactNode } from "react";
import { useNavigate, type To } from "react-router-dom";

interface navigateProps {
    target: To;
    state?: object;
    replace_status: boolean;
    children?: ReactNode;
}

const NavigateButton = ({target, state, replace_status, children}: navigateProps) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(target, {state: state, replace:replace_status})
    }
    return <button onClick={handleClick}>{children}</button>
}

export default NavigateButton;