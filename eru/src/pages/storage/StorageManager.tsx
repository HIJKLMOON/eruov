import { useState, useCallback } from "react";

interface StorageItem {
  key: string;
  value: string;
}

const loadItemsFromStorage = (): StorageItem[] => {
  const data: StorageItem[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    data.push({ key, value: localStorage.getItem(key) || "" });
  }
  return data;
};

export default function StorageManager() {
  const [items, setItems] = useState<StorageItem[]>(loadItemsFromStorage);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const loadItems = useCallback(() => {
    setItems(loadItemsFromStorage());
  }, []);

  const addItem = () => {
    if (newKey) {
      localStorage.setItem(newKey, newValue);
      setNewKey("");
      setNewValue("");
      loadItems();
    }
  };

  const deleteItem = (key: string) => {
    localStorage.removeItem(key);
    loadItems();
  };

  const clearAll = () => {
    localStorage.clear();
    loadItems();
  };

  return (
    <div className="page-card">
      <h1>LocalStorage 管理</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Key"
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Value"
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={addItem}>添加</button>
        <button onClick={clearAll} style={{ marginLeft: "10px" }}>
          清空全部
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>Key</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Value</th>
            <th style={{ padding: "8px" }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{item.key}</td>
              <td
                style={{
                  padding: "8px",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.value}
              </td>
              <td style={{ padding: "8px" }}>
                <button onClick={() => deleteItem(item.key)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p>暂无数据</p>}
    </div>
  );
}
