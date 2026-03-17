import { useState } from 'react';

const ListTodoCard = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React 列表渲染' },
    { id: 2, text: '掌握 key 的使用' }
  ]);
  const [inputText, setInputText] = useState('');

  // 添加待办
  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    // 生成唯一id（真实场景用uuid/接口返回id）
    const newId = Date.now();
    setTodos([...todos, { id: newId, text: inputText }]);
    setInputText('');
  };

  // 删除待办
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ padding: 20 }} className='page-card'>
      <h1>待办事项</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={inputText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
          placeholder="输入待办事项"
        />
        <button type="submit" style={{ marginLeft: 10 }}>添加</button>
      </form>

      <ul style={{ marginTop: 20 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: 10 }}>
            {todo.text}
            <button 
              onClick={() => deleteTodo(todo.id)} 
              style={{ marginLeft: 10, color: 'red' }}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p>暂无待办事项</p>}
    </div>
  );
}

export default ListTodoCard;