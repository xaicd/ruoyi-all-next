export type JsonRpcRequest = {
  jsonrpc: "2.0"
  id: number
  method: string
  params?: unknown
}

export type JsonRpcResponse =
  | { jsonrpc: "2.0"; id: number; result?: unknown }
  | { jsonrpc: "2.0"; id: number; error: { code: number; message: string } }

export declare function encode(message: JsonRpcRequest | JsonRpcResponse): string
export declare function decode(buffer: string): { messages: JsonRpcRequest[]; rest: string }
export declare const REQUIRED_METHODS: readonly string[]
export declare const RPC_ERROR: Readonly<{ methodNotFound: number; internalError: number }>
