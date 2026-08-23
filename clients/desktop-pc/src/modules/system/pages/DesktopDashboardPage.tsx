import React from 'react'
import { SystemTrayCard } from '../components/SystemTrayCard'

export function DesktopDashboardPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>RuoYi All Next 跨平台桌面端</h2>
      <SystemTrayCard serverUrl="http://localhost:3100" />
    </div>
  )
}
