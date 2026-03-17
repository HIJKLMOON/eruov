import { useEffect, useReducer } from "react";

const ACTION_TYPES = {
    INCREAMENT: `Increment`,
    DECREAMENT: `Decrement`,
    RESET: `Reset`
}

const LOCAL_STORAGE_KEY = "counterState";

interface State {
    count: number;
    step: number;
}

const reducer = (state: State, action: { type: string }) => {
    const actionMap: Record<string, State> = {
        [ACTION_TYPES.INCREAMENT]: {...state, count: state.count + state.step },
        [ACTION_TYPES.DECREAMENT]: {...state, count: state.count - state.step },
        [ACTION_TYPES.RESET]: { count: 0, step: 1 }
    }
    return actionMap[action.type] ?? state;
}

const initState = (): State => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : { count: 0, step: 1 };
}

const ReducerTest = () => {
    const initialState = { count: 0, step: 1 };
    const [state, dispatch] = useReducer(reducer, initialState, initState);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    return (
        <div className="page-card">
            <h1>Count: {state.count}</h1>
            <button onClick={() => dispatch({ type: ACTION_TYPES.INCREAMENT })}>Increment</button>
            <button onClick={() => dispatch({ type: ACTION_TYPES.DECREAMENT })}>Decrement</button>
            <button onClick={() => dispatch({ type: ACTION_TYPES.RESET })}>Reset</button>
        </div>
    );
}

export default ReducerTest;