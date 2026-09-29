export type ActionSchema = {
  parse: (input: unknown) => unknown
}

const schemas = new Map<string, ActionSchema>()

export function registerActionSchema(action: string, schema: ActionSchema) {
  schemas.set(action, schema)
}

export function getActionSchema(action: string): ActionSchema | undefined {
  return schemas.get(action)
}

export function applyActionSchema(action: string, params: unknown, extra?: ActionSchema) {
  const schema = extra ?? schemas.get(action)
  if (!schema) return params ?? {}
  try {
    return schema.parse(params ?? {})
  } catch (error: any) {
    throw new Error(`ValidationError: ${error.message ?? "invalid params"}`)
  }
}

export function resetActionSchemas() {
  schemas.clear()
}
