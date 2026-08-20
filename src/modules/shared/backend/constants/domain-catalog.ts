import catalogJson from "./domain-catalog.json"

export type DomainKind = "platform" | "business"
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

export const NATIVE_DOMAIN_NAMES = [
  "system",
  "infra",
  "bpm",
  "pay",
  "report",
  "mp",
  "mall",
  "member",
  "crm",
  "erp",
  "wms",
  "mes",
  "ai",
  "iot",
  "im",
] as const

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

export function listBusinessDomains(): DomainCatalogEntry[] {
  return listDomainCatalog().filter((domain) => domain.kind === "business")
}

export function isFoundationModule(name: string): boolean {
  return listFoundationModules().includes(name)
}

export function moduleLayerOf(name: string): ModuleLayer | undefined {
  if (isFoundationModule(name)) return "foundation"
  const domain = getDomainCatalogEntry(name)
  return domain?.kind
}

export function rpcPolicy(): DomainRpcPolicy {
  return DOMAIN_CATALOG.rpc
}
