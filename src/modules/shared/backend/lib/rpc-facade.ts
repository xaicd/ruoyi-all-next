/**
 * Domain RPC/SDK facade. Callers depend on this surface, never on another
 * domain's Service or Repository. Broker chooses in-process SDK or remote RPC.
 */
import type { BrokerCallOptions, BrokerCallResult } from "./broker-context"
import { broker } from "./service-broker"

export type DomainFacadeMethod = (
  payload?: unknown,
  opts?: BrokerCallOptions,
) => Promise<BrokerCallResult>

export type DomainFacade<M extends string> = {
  domain: string
  invoke: (method: M, payload?: unknown, opts?: BrokerCallOptions) => Promise<BrokerCallResult>
} & Record<M, DomainFacadeMethod>

export function createDomainFacade<M extends string>(domain: string, methods: readonly M[]): DomainFacade<M> {
  const invoke = (method: string, payload?: unknown, opts: BrokerCallOptions = {}) =>
    broker.call(`${domain}.${method}`, payload, {
      ...opts,
      caller: opts.caller ?? `${domain}.facade`,
    })
  const facade = { domain, invoke } as DomainFacade<M>
  for (const method of methods) {
    facade[method] = (payload, opts) => invoke(method, payload, opts)
  }
  return facade
}
