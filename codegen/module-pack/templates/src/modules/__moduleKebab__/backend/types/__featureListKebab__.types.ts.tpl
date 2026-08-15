export type {{featureListPascal}}DO = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
}

export type {{featureListPascal}}VO = {{featureListPascal}}DO
export type {{featureListPascal}}CreateInput = Omit<{{featureListPascal}}DO, "id">
export type {{featureListPascal}}UpdateInput = Partial<{{featureListPascal}}CreateInput> & { id: string }
export type {{featureListPascal}}PageQuery = { page: number; pageSize: number }
