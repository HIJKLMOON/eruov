import { useState } from "react";
import CountButton from "./CountButtonCard";
import './CountCard.css'

const Countplus = () => {
    const [count, setCount] = useState(0)
    const c = 4;
    const incrementCount = () => {
        setCount(c + 1);
    }

    const handleClick = (num: number) => {
        setCount(c => c + num);
    }

    const testIncrementCount = () => {
        setCount(count + 1);
        setCount(count + 2);
        setCount(count + 3);
        setCount(count => count + 1);
    }

    return (
        <div className="page-card">
            <h1>计数器</h1>
            <p style={{ fontSize: '48px', margin: '20px 0' }}>{count}</p>
            <div className="btn-group">
                <button className="btn" onClick={() => setCount(c => c - 1)}>- 1</button>
                <button className="btn" onClick={() => setCount(0)}>重置</button>
                <button className="btn" onClick={() => setCount(c => c + 1)}>+ 1</button>
                <button className="btn" onClick={testIncrementCount}>test：{count}</button>
                <button className="btn" onClick={incrementCount}>c : {c} + 1</button>
                <CountButton count={count} handleClick={handleClick} />
            </div>
        </div>
    )
}

export default Countplus