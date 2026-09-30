import catalogJson from "./domain-catalog.json"

// "plugin": 第一方插件 —— 保留域级特征（可独立打包/被 broker 寻址），
// 但不属于平台层或业务层，单独成层。
export type DomainKind = "platform" | "business" | "plugin"
export type ModuleLayer = "foundation" | "platform" | "business"
export type DomainStage = "A" | "B" | "C"
export type DomainImplementation = "local-ts" | "remote-http" | "remote-go"
export type DomainPackKind = "api-only"
export type DomainTenantPolicy = "required" | "platform" | "optional"
export type RpcInvokeMode = "sdk" | "rpc"
export type RpcProtocol = "in-process" | "nats-rr" | "grpc"
export type RpcSerialization = "none" | "json" | "protobuf"

export type DomainCatalogEntry = {
  name: string
  owner: string
  kind: DomainKind
  stage: DomainStage
  contractVersion: string
  publicPrefixes: string[]
  implementation: DomainImplementation
  upstreamEnv: string
  defaultPort: number
  packable: boolean
  packKind: DomainPackKind
  dependsOnModules: string[]
  independentDatabase: boolean
  manifestMode?: "generated" | "handwritten"
  auth: {
    audience: string
    tenantPolicy: DomainTenantPolicy
  }
  resilience: {
    timeoutMs: number
    retryMaxAttempts: number
    safeMethodsOnly: boolean
    idempotencyRequired: boolean
  }
}

export type MessagingTransport = "in-process" | "nats"

export type DomainMessagingCatalog = {
  protocolVersion: string
  defaultTransport: MessagingTransport
  commandSubjectPrefix: string
  eventSubjectPrefix: string
  headerKeys: {
    contractVersion: string
    traceId: string
    tenantId: string
    actorId: string
    idempotencyKey: string
    sourceDomain: string
  }
}

export type DomainCatalogLayers = {
  foundation: {
    modules: string[]
    deployable: false
    invoke: "sdk"
    description: string
  }
  platform: {
    domains: string[]
    deployable: boolean
    defaultColocateWith: string
  }
  business: {
    domains: string[]
    deployable: boolean
  }
}

export type DomainRpcPolicy = {
  local: {
    mode: "sdk"
    protocol: "in-process"
    serialization: "none"
    facadeRequired: true
  }
  remote: {
    mode: "rpc"
    protocol: "nats-rr"
    serialization: "json"
    facadeRequired: true
    httpPath: string
  }
  stageC: {
    protocol: "grpc"
    serialization: "protobuf"
  }
  rejected: string[]
}

export type DomainCatalog = {
  version: number
  description: string
  layers: DomainCatalogLayers
  rpc: DomainRpcPolicy
  messaging: DomainMessagingCatalog
  domains: DomainCatalogEntry[]
}

export const DOMAIN_CATALOG: DomainCatalog = catalogJson as DomainCatalog

/**
 * Derived from catalog layer declarations so it can never drift again.
 * A hand-written copy previously omitted `online` and `aigw`.
 */
export const NATIVE_DOMAIN_NAMES: readonly string[] = [
  ...DOMAIN_CATALOG.layers.platform.domains,
  ...DOMAIN_CATALOG.layers.business.domains,
  // 第一方插件仍是本仓原生能力，只是不属于平台层或业务层，单独成层
  ...((DOMAIN_CATALOG.layers as { plugin?: { domains: string[] } }).plugin?.domains ?? []),
]

export function listDomainCatalog(): DomainCatalogEntry[] {
  return DOMAIN_CATALOG.domains
}

export function getDomainCatalogEntry(name: string): DomainCatalogEntry | undefined {
  return DOMAIN_CATALOG.domains.find((domain) => domain.name === name)
}

export function requireDomainCatalogEntry(name: string): DomainCatalogEntry {
  const domain = getDomainCatalogEntry(name)
  if (!domain) {
    throw new Error(`Unknown domain: ${name}`)
  }
  return domain
}

export function listFoundationModules(): string[] {
  return DOMAIN_CATALOG.layers.foundation.modules
}

export function listPlatformDomains(): DomainCatalogEntry[] {
  return listDomainCatalog().filter((domain) => domain.kind === "platform")
}

/**
 * 业务层（**严格**按 layer 语义，不含已插件化的域）。
 *
 * 域被插件化后会移出本层放进 `layers.plugin`。"是否需要把两层合并看待"由**调用方**
 * 决定（判别标准是"要的是业务域还是可插拔插件"）—— 见 AGENTS.md §3.2.1 第 3 条。
 * 遍历"业务域"的调用方通常要合并两层; 只读本函数会拿到空集, 而空集**不报错**,
 * 只是静默什么都不做（孵化裁剪 / 跨域分层检查 / 测试覆盖统计都出过"规则空转但门禁仍绿"）。
 */
export function listBusinessDomains(): DomainCatalogEntry[] {
  return listDomainCatalog().filter((domain) => domain.kind === "business")
}

/** 仅已插件化的业务域（插件层）。 */
export function listPluginDomains(): DomainCatalogEntry[] {
  return listDomainCatalog().filter((domain) => domain.kind === "plugin")
}

export function isFoundationModule(name: string): boolean {
  return listFoundationModules().includes(name)
}

export function moduleLayerOf(name: string): ModuleLayer | undefined {
  if (isFoundationModule(name)) return "foundation"
  const domain = getDomainCatalogEntry(name)
  if (!domain || domain.kind === "plugin") return undefined // 插件不属于任何模块层
  return domain.kind
}

export function rpcPolicy(): DomainRpcPolicy {
  return DOMAIN_CATALOG.rpc
}
