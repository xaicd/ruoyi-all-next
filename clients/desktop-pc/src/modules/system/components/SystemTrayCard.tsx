import React from 'react'

export function SystemTrayCard({ serverUrl }: { serverUrl: string }) {
  return (
    <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8 }}>
      <h4>桌面客户端连接就绪</h4>
      <p style={{ fontSize: 12, color: '#64748b' }}>服务端地址: {serverUrl}</p>
    </div>
  )
}
