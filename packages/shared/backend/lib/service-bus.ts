/**
 * Service Bus facade. Cross-domain sync commands go through the Moleculer-style broker
 * while keeping the previous call() signature.
 */
import { registerService } from "./broker-invoke"
import { circuitReset } from "./broker-resilience"
import { broker } from "./service-broker"
import type { BrokerCallResult } from "./broker-context"

export { registerService }

export type ServiceCallOptions = {
  service: string
  method: string
  payload?: unknown
  timeout?: number
  retries?: number
  idempotencyKey?: string
  caller?: string
  traceId?: string
}

export type ServiceCallResult<T = unknown> = BrokerCallResult<T>

export const serviceBus = {
  call<T = unknown>(options: ServiceCallOptions): Promise<ServiceCallResult<T>> {
    return broker.call<unknown, T>(`${options.service}.${options.method}`, options.payload, {
      timeout: options.timeout,
      retries: options.retries,
      idempotencyKey: options.idempotencyKey,
      caller: options.caller,
      traceId: options.traceId,
    })
  },
  getCircuitBreakerStatus() {
    return broker.getCircuitBreakerStatus()
  },
  resetCircuitBreaker(service?: string) {
    circuitReset(service)
  },
}
