type DataSourceConfig = {
  name: string
  driver: string
  url: string
}

const DATASOURCE_REGISTRY = new Map<string, DataSourceConfig>()

export function registerDatasource(config: DataSourceConfig) {
  DATASOURCE_REGISTRY.set(config.name, config)
}

export function getDatasource(name: string) {
  return DATASOURCE_REGISTRY.get(name) ?? null
}

export function listDatasources() {
  return Array.from(DATASOURCE_REGISTRY.values())
}

export function clearDatasources() {
  DATASOURCE_REGISTRY.clear()
}
