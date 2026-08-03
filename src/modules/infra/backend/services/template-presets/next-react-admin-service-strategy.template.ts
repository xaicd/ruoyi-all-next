export const nextReactAdminServiceStrategyTemplate = `import { Errors } from "@/lib/errors"

export type {{entityName}}StrategyKey = "DEFAULT" | "FAST_PATH"

export type {{entityName}}StrategyContext = {
  payload: Record<string, unknown>
}

export type {{entityName}}StrategyResult = {
  mode: {{entityName}}StrategyKey
  accepted: boolean
}

export interface {{entityName}}Strategy {
  key: {{entityName}}StrategyKey
  execute(context: {{entityName}}StrategyContext): Promise<{{entityName}}StrategyResult>
}

class Default{{entityName}}Strategy implements {{entityName}}Strategy {
  key: {{entityName}}StrategyKey = "DEFAULT"

  async execute(): Promise<{{entityName}}StrategyResult> {
    return { mode: this.key, accepted: true }
  }
}

class FastPath{{entityName}}Strategy implements {{entityName}}Strategy {
  key: {{entityName}}StrategyKey = "FAST_PATH"

  async execute(context: {{entityName}}StrategyContext): Promise<{{entityName}}StrategyResult> {
    return {
      mode: this.key,
      accepted: Object.keys(context.payload).length > 0,
    }
  }
}

const STRATEGY_REGISTRY: Record<{{entityName}}StrategyKey, {{entityName}}Strategy> = {
  DEFAULT: new Default{{entityName}}Strategy(),
  FAST_PATH: new FastPath{{entityName}}Strategy(),
}

export class {{entityName}}StrategyResolver {
  static resolve(key: {{entityName}}StrategyKey): {{entityName}}Strategy {
    const strategy = STRATEGY_REGISTRY[key]
    if (!strategy) {
      throw Errors.VALIDATION_ERROR("未找到可用策略")
    }
    return strategy
  }
}
`
