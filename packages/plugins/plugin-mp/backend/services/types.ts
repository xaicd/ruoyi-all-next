export type MpAccount = {
  id: string
  name: string
  appId: string
  status: "ACTIVE" | "DISABLED"
}

export type MpFan = {
  id: string
  nickname: string
  accountId: string
  subscribed: boolean
}

export const MOCK_ACCOUNTS: MpAccount[] = [
  { id: "mp-001", name: "乡村振兴服务号", appId: "wx001", status: "ACTIVE" },
  { id: "mp-002", name: "乡村文旅订阅号", appId: "wx002", status: "ACTIVE" },
]

export const MOCK_FANS: MpFan[] = [
  { id: "fan-001", nickname: "山河游客", accountId: "mp-001", subscribed: true },
  { id: "fan-002", nickname: "乡村体验官", accountId: "mp-002", subscribed: true },
]
