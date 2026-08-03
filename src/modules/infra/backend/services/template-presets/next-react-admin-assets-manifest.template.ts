export const nextReactAdminAssetsManifestTemplate = `export const {{entityName}}Assets = {
  logo: "/assets/admin/{{modulePath}}/logo.svg",
  empty: "/assets/admin/{{modulePath}}/empty.png",
  banner: "/assets/admin/{{modulePath}}/banner.webp",
} as const

export type {{entityName}}AssetKey = keyof typeof {{entityName}}Assets

export function get{{entityName}}Asset(key: {{entityName}}AssetKey): string {
  return {{entityName}}Assets[key]
}
`