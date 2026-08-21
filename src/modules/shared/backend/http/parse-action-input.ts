/**
 * Parse HTTP query/body with the same Zod schema registered for broker actions.
 * Route and RPC therefore share one validator file.
 */
export function parseActionQuery<T>(schema: { parse: (input: unknown) => T }, request: Request): T {
  return schema.parse(Object.fromEntries(new URL(request.url).searchParams))
}

export function parseActionBody<T>(schema: { parse: (input: unknown) => T }, body: unknown): T {
  return schema.parse(body ?? {})
}
