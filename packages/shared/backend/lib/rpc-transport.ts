/**
 * Remote RPC adapter. Facade stays stable; this module swaps in-process fabric vs HTTP hop.
 */
import { natsRequest } from "./nats-fabric"
import { grpcMethodPath, grpcUnary } from "./grpc-fabric"
import { httpRpcCall, resolveRpcBaseUrl } from "./rpc-http"
import {
  decodeRpcPayload,
  encodeRpcPayload,
  resolveRemoteProtocol,
  resolveRemoteSerialization,
} from "./rpc-protocol"

export async function dispatchRemoteAction(input: {
  domain: string
  method: string
  subject: string
  payload: unknown
  headers: Record<string, string>
  timeoutMs: number
  env?: NodeJS.Dict<string>
}): Promise<unknown> {
  const env = input.env
  if (resolveRpcBaseUrl(input.domain, env)) {
    return httpRpcCall(input)
  }
  const protocol = resolveRemoteProtocol(env)
  const serialization = resolveRemoteSerialization(protocol)
  const wire = encodeRpcPayload(input.payload, serialization)
  if (protocol === "grpc") {
    const reply = await grpcUnary(grpcMethodPath(input.domain, input.method), wire, {
      metadata: input.headers,
      timeoutMs: input.timeoutMs,
    })
    return decodeRpcPayload(reply, serialization)
  }
  return natsRequest(input.subject, wire, {
    headers: input.headers,
    timeoutMs: input.timeoutMs,
  })
}
