export const nextReactAdminServiceRpcTemplate = `/**
 * Dual-mode RPC surface for {{serviceName}}.
 * Same-process is in-memory SDK via broker; split-process uses the same methods over RPC.
 * Cross-domain callers must use createDomainFacade("{{moduleName}}"), never import another domain's Service.
 */
export const {{entityName}}RpcMethods = ["list", "create", "execute"] as const

export const {{entityName}}RpcBinding = {
  domain: "{{moduleName}}",
  service: "{{serviceName}}",
  module: "{{featureKebab}}.service",
  methods: {{entityName}}RpcMethods,
} as const
`
