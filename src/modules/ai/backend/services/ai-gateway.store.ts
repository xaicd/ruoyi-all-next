export type AiProvider =
  | "OPENAI"
  | "AZURE"
  | "ANTHROPIC"
  | "GEMINI"
  | "TONGYI"
  | "DEEPSEEK"
  | "MOMA"
  | "CUSTOM"
  | "MOCK"

export type AiChannelRecord = {
  id: string
  name: string
  provider: AiProvider
  baseUrl: string
  apiKey: string
  models: string[]
  modelMap: Record<string, string>
  weight: number
  priority: number
  status: "ACTIVE" | "DISABLED"
  autoDisable: boolean
  failCount: number
  protocol: "openai"
  createdAt: string
}

export type AiAccessTokenRecord = {
  id: string
  name: string
  key: string
  status: "ACTIVE" | "DISABLED"
  remainQuota: number
  unlimited: boolean
  models: string[]
  ipAllowlist: string[]
  group: string
  expiresAt?: string
  createdAt: string
}

export type AiUsageRecord = {
  id: string
  tokenId: string
  channelId: string
  model: string
  promptTokens: number
  completionTokens: number
  success: boolean
  latencyMs: number
  error?: string
  createdAt: string
}

const channels: AiChannelRecord[] = [
  {
    id: "ch-mock-001",
    name: "本地探测渠",
    provider: "MOCK",
    baseUrl: "",
    apiKey: "",
    models: ["gpt-4o-mini", "qwen-plus", "mock-chat"],
    modelMap: {},
    weight: 100,
    priority: 10,
    status: "ACTIVE",
    autoDisable: false,
    failCount: 0,
    protocol: "openai",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
]

const tokens: AiAccessTokenRecord[] = [
  {
    id: "tok-demo-001",
    name: "演示令牌",
    key: "sk-ruoyi-demo-gateway",
    status: "ACTIVE",
    remainQuota: 1_000_000,
    unlimited: false,
    models: [],
    ipAllowlist: [],
    group: "default",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
]

const usages: AiUsageRecord[] = []

let channelSeq = 100
let tokenSeq = 100
let usageSeq = 100

export const aiGatewayStore = {
  channels,
  tokens,
  usages,
  nextChannelId() {
    return `ch-${++channelSeq}`
  },
  nextTokenId() {
    return `tok-${++tokenSeq}`
  },
  nextUsageId() {
    return `ulog-${++usageSeq}`
  },
  resetForTest() {
    channels.splice(1)
    channels[0]!.status = "ACTIVE"
    channels[0]!.failCount = 0
    tokens.splice(1)
    tokens[0]!.status = "ACTIVE"
    tokens[0]!.remainQuota = 1_000_000
    usages.splice(0)
    channelSeq = 100
    tokenSeq = 100
    usageSeq = 100
  },
}

export function maskSecret(value: string): string {
  if (!value) return ""
  if (value.length <= 8) return "****"
  return `${value.slice(0, 4)}****${value.slice(-4)}`
}
