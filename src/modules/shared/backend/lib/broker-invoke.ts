import rpcActions from "../constants/rpc-actions.json"

type ServiceResolver = (method: string, payload: unknown) => Promise<unknown>

type RpcActionSpec = {
  method: string
  service?: string
  target?: string
  module?: string
}

const localRegistry = new Map<string, ServiceResolver>()

export function registerService(domain: string, resolver: ServiceResolver) {
  localRegistry.set(domain, resolver)
}

export function unregisterService(domain: string) {
  localRegistry.delete(domain)
}

export function resetServiceInvokers() {
  localRegistry.clear()
}

function readPayloadNumber(payload: unknown, key: string): number | undefined {
  if (!payload || typeof payload !== "object") return undefined
  const value = (payload as Record<string, unknown>)[key]
  return typeof value === "number" ? value : undefined
}

function resolveActionSpec(domain: string, method: string): RpcActionSpec {
  const catalog = rpcActions as { domains?: Record<string, { actions?: RpcActionSpec[] }> }
  const match = catalog.domains?.[domain]?.actions?.find((item) => item.method === method)
  return {
    method,
    service: match?.service,
    target: match?.target ?? method,
    module: match?.module,
  }
}

async function loadDomainServices(domain: string, moduleName?: string): Promise<Record<string, unknown>> {
  if (moduleName) {
    return import(`@/modules/${domain}/backend/services/${moduleName}`) as Promise<Record<string, unknown>>
  }
  return import(`@/modules/${domain}/backend/services`) as Promise<Record<string, unknown>>
}

function readMethod(holder: unknown, method: string): ((input: unknown) => Promise<unknown>) | undefined {
  if (!holder) return undefined
  const target = (holder as Record<string, unknown>)[method]
  if (typeof target === "function") {
    return (target as (input: unknown) => Promise<unknown>).bind(holder)
  }
  return undefined
}

function findExportedMethod(
  mod: Record<string, unknown>,
  method: string,
  exportName?: string,
): ((input: unknown) => Promise<unknown>) | undefined {
  if (exportName) {
    return readMethod(mod[exportName], method)
  }
  for (const value of Object.values(mod)) {
    const found = readMethod(value, method)
    if (found) return found
  }
  return undefined
}

export async function invokeAction(domain: string, method: string, payload: unknown): Promise<unknown> {
  if (localRegistry.has(domain)) return localRegistry.get(domain)!(method, payload)
  if (method === "ping") {
    return { pong: true, domain, n: readPayloadNumber(payload, "n") }
  }
  const spec = resolveActionSpec(domain, method)
  const mod = await loadDomainServices(domain, spec.module)
  const target =
    findExportedMethod(mod, spec.target ?? method, spec.service) ??
    (spec.service ? findExportedMethod(mod, spec.target ?? method) : undefined)
  if (target) return target(payload)
  throw new Error(`Method ${spec.target ?? method} not found in ${domain} service${spec.service ? ` (${spec.service})` : ""}`)
}
