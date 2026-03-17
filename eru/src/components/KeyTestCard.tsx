import { useState } from "react";

const KeyTestCard = () => {
  const [listWithoutKey, setListWithoutKey] = useState([
    { name: '苹果' },
    { name: '香蕉' },
    { name: '橙子' }
  ]);

  const [listWithKey, setListWithKey] = useState([
    { id: 1001, name: '苹果' },
    { id: 1002, name: '香蕉' },
    { id: 1003, name: '橙子' }
  ]);
  // 删除第一项
  const deleteFirstWithoutKey = () => {
    setListWithoutKey(listWithoutKey.slice(1));
  };

  const deleteFirstWithKey = () => {
    setListWithKey(listWithKey.slice(1));
  };

  return (
    <div className="page-card">
      <button onClick={deleteFirstWithoutKey}>删除使用索引作为key的第一项</button>
      <ul>
        {listWithoutKey.map((item, index) => (
          <li key={index}>
            {item.name}
            {/* 输入框：状态会绑定到索引，而非列表项 */}
            <input type="text" placeholder="输入备注" style={{ marginLeft: 10 }} />
          </li>
        ))}
      </ul>
    
      <button onClick={deleteFirstWithKey}>删除使用id作为key的+第一项</button>
      <ul>
        {listWithKey.map((item) => (
          <li key={item.id}>
            {item.name}
            {/* 输入框：状态会绑定到索引，而非列表项 */}
            <input type="text" placeholder="输入备注" style={{ marginLeft: 10 }} />
          </li>
        ))}
      </ul>
    </div>
  );
}


export default KeyTestCard;