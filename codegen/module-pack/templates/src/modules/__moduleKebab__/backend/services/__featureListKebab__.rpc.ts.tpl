/**
 * Dual-mode RPC surface for {{featureListPascal}}Service.
 * Same-process is in-memory SDK via broker; split-process uses the same methods over RPC.
 * Cross-domain callers must use createDomainFacade("{{moduleKebab}}"), never import another domain's Service.
 */
export const {{featureListPascal}}RpcMethods = ["page", "get", "create", "update", "delete"] as const

export const {{featureListPascal}}RpcBinding = {
  domain: "{{moduleKebab}}",
  service: "{{featureListPascal}}Service",
  module: "{{featureListKebab}}.service",
  methods: {{featureListPascal}}RpcMethods,
} as const
