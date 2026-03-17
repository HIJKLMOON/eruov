import React, { useRef } from "react";

const EventCard = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputRef.current && textareaRef.current && inputRef.current.value.trim() !== '') {
            localStorage.setItem(inputRef.current.name, inputRef.current.value);
            textareaRef.current.value = inputRef.current.value;
            // console.log(inputRef.current.value);
            inputRef.current.value = '';
        }
    } // 监听表单提交事件，将输入框的值显示在文本区域中

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        if (e.type !== 'keyup') return;
        if (inputRef.current) {
            console.log(inputRef.current.value);
            textareaRef.current!.value = inputRef.current.value;
            inputRef.current.value = '';
        }
    }

    return (
        <div className="page-card">
            <form onSubmit={handleSubmit}>
                <input
                    name="nickName"
                    type="text"
                    ref={inputRef}
                    placeholder="Nick Name"
                    onKeyUp={handleKeyUp}
                />
                <button className="btn" type="submit">提交</button>
                <textarea
                    ref={textareaRef}
                    readOnly
                    rows={4}
                    style={{ marginLeft: '20px', verticalAlign: 'top' }}
                />
            </form>
        </div>
    )
}

export default EventCard;