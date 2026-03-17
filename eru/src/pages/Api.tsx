import { useState } from 'react'

interface ApiResult {
  status: number
  data: unknown
  time: number
}

export default function Api() {
  const [url, setUrl] = useState('http://localhost:4234')
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState('')

  const sendRequest = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    const startTime = Date.now()

    try {
      const options: RequestInit = { method }
      if (method !== 'GET' && body) {
        options.headers = { 'Content-Type': 'application/json' }
        options.body = body
      }

      const res = await fetch(url, options)
      const data = await res.json()
      const time = Date.now() - startTime

      setResult({ status: res.status, data, time })
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-card">
      <h1>API 请求</h1>
      
      <div style={{ marginBottom: '16px' }}>
        <select value={method} onChange={e => setMethod(e.target.value as any)} style={{ marginRight: '10px' }}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="请求地址"
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={sendRequest} disabled={loading} style={{ marginLeft: '10px' }}>
          {loading ? '发送中...' : '发送'}
        </button>
      </div>

      {method !== 'GET' && (
        <div style={{ marginBottom: '16px' }}>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="请求体 (JSON)"
            rows={4}
            style={{ width: '100%', padding: '8px', fontFamily: 'monospace' }}
          />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>错误: {error}</p>}

      {result && (
        <div>
          <p>状态: {result.status} | 耗时: {result.time}ms</p>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
