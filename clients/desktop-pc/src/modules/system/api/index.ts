import { DesktopSystemStatus } from '../models'

export const desktopSystemApi = {
  checkStatus: async (): Promise<DesktopSystemStatus> => ({
    online: true,
    memoryUsageMb: 85,
    serverUrl: 'http://localhost:3100'
  })
}
