/**
 * Service Bus - 域间通信统一入口
 *
 * 设计目标：
 * - 阶段A（当前）：本地直接调用，零网络开销
 * - 阶段B：加入超时、重试、熔断、traceId 透传
 * - 阶段C：切换为 HTTP/gRPC 远程调用
 *
 * 规范：
 * - 同域内部调用：直接 import（无限制）
 * - 跨域调用：必须走 serviceBus.call()
 * - 禁止跨域直接 import 其他域的 service
 */

// ============ Types ============

export type ServiceCallOptions = {
  /** 目标服务域 */
  service: string
  /** 目标方法名 */
  method: string
  /** 调用参数 */
  payload?: unknown
  /** 调用超时（ms），默认 5000 */
  timeout?: number
  /** 重试次数，默认 0 */
  retries?: number
  /** 幂等键（用于安全重试） */
  idempotencyKey?: string
  /** 调用来源（用于链路追踪） */
  caller?: string
  /** 请求追踪 ID */
  traceId?: string
}

export type ServiceCallResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  duration: number
  traceId: string
}

type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN"

type CircuitBreaker = {
  state: CircuitBreakerState
  failures: number
  lastFailure: number
  nextAttempt: number
}

// ============ Config ============

const DEFAULT_TIMEOUT = 5000
const DEFAULT_RETRIES = 0
const CIRCUIT_BREAKER_THRESHOLD = 5
const CIRCUIT_BREAKER_RESET_MS = 30000

// ============ State ============

const circuitBreakers = new Map<string, CircuitBreaker>()

function getCircuitBreaker(service: string): CircuitBreaker {
  if (!circuitBreakers.has(service)) {
    circuitBreakers.set(service, { state: "CLOSED", failures: 0, lastFailure: 0, nextAttempt: 0 })
  }
  return circuitBreakers.get(service)!
}

function recordSuccess(service: string) {
  const cb = getCircuitBreaker(service)
  cb.failures = 0
  cb.state = "CLOSED"
}

function recordFailure(service: string) {
  const cb = getCircuitBreaker(service)
  cb.failures++
  cb.lastFailure = Date.now()
  if (cb.failures >= CIRCUIT_BREAKER_THRESHOLD) {
    cb.state = "OPEN"
    cb.nextAttempt = Date.now() + CIRCUIT_BREAKER_RESET_MS
  }
}

function canCall(service: string): boolean {
  const cb = getCircuitBreaker(service)
  if (cb.state === "CLOSED") return true
  if (cb.state === "OPEN" && Date.now() > cb.nextAttempt) {
    cb.state = "HALF_OPEN"
    return true
  }
  return cb.state === "HALF_OPEN"
}

// ============ Service Registry ============

/**
 * 服务注册表
 * 阶段A/B：本地 import 映射
 * 阶段C：替换为 HTTP endpoint 映射
 */
type ServiceResolver = (method: string, payload: unknown) => Promise<unknown>

const localRegistry = new Map<string, ServiceResolver>()

/**
 * 注册本地服务（每个域在启动时调用）
 */
export function registerService(domain: string, resolver: ServiceResolver) {
  localRegistry.set(domain, resolver)
}

/**
 * 懒加载服务模块（阶段 A/B 使用）
 */
async function resolveLocal(service: string, method: string, payload: unknown): Promise<unknown> {
  // 优先使用显式注册的 resolver
  if (localRegistry.has(service)) {
    return localRegistry.get(service)!(method, payload)
  }

  // 动态 import 兜底（仅阶段 A）
  try {
    const mod = await import(`@/modules/${service}/backend/services`)
    const serviceClass = Object.values(mod).find(
      (v: any) => typeof v === "function" || (typeof v === "object" && v !== null),
    ) as any
    if (serviceClass && typeof serviceClass[method] === "function") {
      return serviceClass[method](payload)
    }
    throw new Error(`Method ${method} not found in ${service} service`)
  } catch (e: any) {
    throw new Error(`Service ${service}.${method} resolve failed: ${e.message}`)
  }
}

// ============ Core Call ============

function generateTraceId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * 跨域服务调用入口
 *
 * @example
 * // mall 域调用 pay 域创建支付单
 * const result = await serviceBus.call({
 *   service: "pay",
 *   method: "createOrder",
 *   payload: { amount: 9900, merchantOrderId: "MO-001" },
 *   caller: "mall.order",
 *   timeout: 3000,
 * })
 */
export const serviceBus = {
  async call<T = unknown>(options: ServiceCallOptions): Promise<ServiceCallResult<T>> {
    const {
      service,
      method,
      payload,
      timeout = DEFAULT_TIMEOUT,
      retries = DEFAULT_RETRIES,
      caller = "unknown",
      traceId = generateTraceId(),
    } = options

    const startTime = Date.now()

    // 熔断检查
    if (!canCall(service)) {
      return {
        success: false,
        error: `Circuit breaker OPEN for service: ${service}`,
        duration: 0,
        traceId,
      }
    }

    let lastError: string = ""

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // 超时控制
        const result = await Promise.race([
          resolveLocal(service, method, payload),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout),
          ),
        ])

        recordSuccess(service)

        return {
          success: true,
          data: result as T,
          duration: Date.now() - startTime,
          traceId,
        }
      } catch (e: any) {
        lastError = e.message
        recordFailure(service)

        // 如果不是最后一次重试，等待后重试
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, Math.min(1000 * (attempt + 1), 5000)))
        }
      }
    }

    return {
      success: false,
      error: lastError,
      duration: Date.now() - startTime,
      traceId,
    }
  },

  /** 获取熔断器状态（用于监控） */
  getCircuitBreakerStatus(): Record<string, CircuitBreaker> {
    const status: Record<string, CircuitBreaker> = {}
    circuitBreakers.forEach((v, k) => { status[k] = { ...v } })
    return status
  },

  /** 重置熔断器（运维用） */
  resetCircuitBreaker(service: string) {
    circuitBreakers.delete(service)
  },
}
