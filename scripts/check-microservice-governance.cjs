const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const catalogPath = path.join(ROOT, "src", "modules", "shared", "backend", "constants", "microservice-governance.json")
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"))

function fail(message) {
  throw new Error(`[microservice-governance] ${message}`)
}

if (!Array.isArray(catalog.capabilities) || catalog.capabilities.length < 20) {
  fail("governance catalog must declare at least 20 Moleculer/Nest NATS capabilities")
}

const required = ["broker", "gateway", "action", "event", "queueGroup", "registry", "circuitBreaker", "bulkhead", "fallback", "natsAdapter", "jetStream", "outbox", "cacher", "validator", "moduleLayers", "dualInvoke", "rpcCodec", "rpcFacade", "rpcTransport", "grpcAdapter", "protobufCodec", "contractActions", "rpcActionsCatalog", "domainProto", "goStub", "httpRpc", "splitRuntime", "lowcodeTemplates", "schemaConfluence"]
for (const id of required) {
  const item = catalog.capabilities.find((capability) => capability.id === id)
  if (!item || item.status === "TODO") fail(`${id} must not be TODO`)
}

for (const capability of catalog.capabilities) {
  const target = path.join(ROOT, capability.ref)
  if (!fs.existsSync(target)) fail(`${capability.id} missing ref ${capability.ref}`)
  const source = fs.readFileSync(target, "utf8")
  if (!source.includes(capability.marker)) fail(`${capability.id} marker not found in ${capability.ref}: ${capability.marker}`)
}

const brokerPath = path.join(ROOT, "src", "modules", "shared", "backend", "lib", "service-broker.ts")
const brokerSource = fs.readFileSync(brokerPath, "utf8")
for (const method of ["call", "mcall", "emit", "broadcast", "publishReliable", "cacher", "ping", "waitForServices", "getMetrics", "useMiddleware", "registerRemoteService"]) {
  if (!brokerSource.includes(method)) fail(`broker is missing ${method}`)
}

const domainCatalogPath = path.join(ROOT, "src", "modules", "shared", "backend", "constants", "domain-catalog.json")
const domainCatalog = JSON.parse(fs.readFileSync(domainCatalogPath, "utf8"))
if (!domainCatalog.layers?.foundation?.modules?.includes("shared")) fail("shared must be a foundation module")
if (domainCatalog.layers.foundation.deployable !== false) fail("foundation modules must not be independently deployable")
if (domainCatalog.domains.some((domain) => domain.name === "shared")) fail("shared must not be registered as a domain service")
if (!Array.isArray(domainCatalog.layers.platform?.domains) || domainCatalog.layers.platform.domains.join(",") !== "system,infra") {
  fail("platform domains must be system, infra")
}
const domainNames = domainCatalog.domains.map((domain) => domain.name).sort()
const layered = [...domainCatalog.layers.platform.domains, ...domainCatalog.layers.business.domains].sort()
if (domainNames.join(",") !== layered.join(",")) fail("every catalog domain must appear in exactly one of platform/business layers")
for (const name of domainCatalog.layers.platform.domains) {
  const domain = domainCatalog.domains.find((item) => item.name === name)
  if (!domain || domain.kind !== "platform") fail(`${name} must have kind=platform`)
}
for (const name of domainCatalog.layers.business.domains) {
  const domain = domainCatalog.domains.find((item) => item.name === name)
  if (!domain || domain.kind !== "business") fail(`${name} must have kind=business`)
}
if (domainCatalog.rpc?.local?.mode !== "sdk" || domainCatalog.rpc?.remote?.mode !== "rpc") fail("rpc dual-mode must be local=sdk remote=rpc")
if (!domainCatalog.rpc.local.facadeRequired || !domainCatalog.rpc.remote.facadeRequired) fail("RPC/SDK facade is required")
if (domainCatalog.rpc.remote.protocol !== "nats-rr" || domainCatalog.rpc.remote.serialization !== "json") {
  fail("default remote RPC must be nats-rr + json")
}
if (domainCatalog.rpc.remote.httpPath !== "/api/internal/rpc") fail("split-process RPC must use /api/internal/rpc")
if (domainCatalog.rpc.stageC.protocol !== "grpc" || domainCatalog.rpc.stageC.serialization !== "protobuf") {
  fail("stage C typed RPC must be grpc + protobuf")
}
for (const protocol of ["dubbo", "thrift"]) {
  if (!domainCatalog.rpc.rejected.includes(protocol)) fail(`must reject ${protocol} as a default RPC protocol`)
}

const rpcProtocolPath = path.join(ROOT, "src", "modules", "shared", "backend", "lib", "rpc-protocol.ts")
const rpcProtocolSource = fs.readFileSync(rpcProtocolPath, "utf8")
if (!rpcProtocolSource.includes("resolveInvokeMode") || !rpcProtocolSource.includes("encodeRpcPayload") || !rpcProtocolSource.includes("encodeProtobufFrame")) {
  fail("rpc-protocol.ts must implement dual invoke, codec and protobuf frames")
}

const grpcPath = path.join(ROOT, "src", "modules", "shared", "backend", "lib", "grpc-fabric.ts")
const grpcSource = fs.readFileSync(grpcPath, "utf8")
if (!grpcSource.includes("grpcUnary") || !grpcSource.includes("/ruoyi.")) fail("grpc-fabric.ts must implement in-house unary paths")

const payFacadePath = path.join(ROOT, "src", "modules", "pay", "contract", "pay.facade.ts")
if (!fs.readFileSync(payFacadePath, "utf8").includes("createDomainFacade")) fail("pay contract facade is required")

const protoPath = path.join(ROOT, "src", "modules", "pay", "contract", "pay.proto")
if (!fs.existsSync(protoPath) || !fs.readFileSync(protoPath, "utf8").includes("service PayService")) {
  fail("pay.proto must declare PayService; run npm run domain:contracts")
}

const goStubPath = path.join(ROOT, "gen", "go", "pay", "v1", "service.go")
if (!fs.existsSync(goStubPath) || !fs.readFileSync(goStubPath, "utf8").includes("type PayService interface")) {
  fail("gen/go/pay/v1/service.go must declare PayService; run npm run domain:contracts")
}

const rpcActionsPath = path.join(ROOT, "src", "modules", "shared", "backend", "constants", "rpc-actions.json")
const rpcActions = JSON.parse(fs.readFileSync(rpcActionsPath, "utf8"))
for (const domain of domainCatalog.domains) {
  if (!rpcActions.domains?.[domain.name]) fail(`rpc-actions.json must declare ${domain.name}`)
}

const infraActions = rpcActions.domains?.infra?.actions?.map((item) => item.method) ?? []
for (const method of ["previewCodegen", "generateCodegen", "previewTemplate", "generateTemplate"]) {
  if (!infraActions.includes(method)) fail(`rpc-actions.json infra must declare ${method}`)
}

const systemActions = rpcActions.domains?.system?.actions?.map((item) => item.method) ?? []
if (!systemActions.includes("getDictDataByType")) fail("rpc-actions.json system must declare getDictDataByType")
if (!systemActions.includes("resolveTenantEntitlement")) fail("rpc-actions.json system must declare resolveTenantEntitlement")

const onlineActions = rpcActions.domains?.online?.actions?.map((item) => item.method) ?? []
for (const method of ["pageDefinitions", "resolvePublishedRelease", "resolveCodegenImport", "pageManagedRecords", "getManagedRecord", "createManagedRecord", "updateManagedRecord", "deleteManagedRecord"]) {
  if (!onlineActions.includes(method)) fail(`rpc-actions.json online must declare ${method}`)
}

const payRefundActions = rpcActions.domains?.pay?.actions?.map((item) => item.method) ?? []
if (!payRefundActions.includes("listRefunds")) fail("rpc-actions.json pay must declare listRefunds")

for (const [domain, spec] of Object.entries(rpcActions.domains ?? {})) {
  const validatorsDir = path.join(ROOT, "src", "modules", domain, "backend", "validators")
  if (!fs.existsSync(validatorsDir)) fail(`missing validators for ${domain}`)
  const validatorSource = fs.readdirSync(validatorsDir).filter((name) => name.endsWith(".ts")).map((name) => fs.readFileSync(path.join(validatorsDir, name), "utf8")).join("\n")
  for (const action of spec.actions ?? []) {
    if (action.schema === "ping") continue
    if (!validatorSource.includes(`export const ${action.schema}`)) {
      fail(`rpc-actions.json ${domain}.${action.method} schema ${action.schema} must live in ${domain} backend validators`)
    }
  }
}

const guardsPath = path.join(ROOT, "src", "modules", "shared", "backend", "auth", "guards.ts")
const guardsSource = fs.readFileSync(guardsPath, "utf8")
if (guardsSource.includes("TenantEntitlementService")) fail("shared guards must not import TenantEntitlementService; use systemFacade")
if (!guardsSource.includes("systemFacade")) fail("shared guards must call tenant entitlement through systemFacade")

const codegenTablesPath = path.join(ROOT, "src", "app", "api", "v1", "admin", "infra", "codegen", "tables", "route.ts")
const codegenTables = fs.readFileSync(codegenTablesPath, "utf8")
if (codegenTables.includes("OnlineDefinitionService") || codegenTables.includes("KyselyOnlineRuntimeRepository")) {
  fail("infra codegen tables route must not import online Service/Repository; use onlineFacade")
}
if (!codegenTables.includes("onlineFacade")) fail("infra codegen tables route must call online through onlineFacade")

const onlineAdapterPath = path.join(ROOT, "src", "modules", "online", "backend", "application", "online-codegen.adapter.ts")
const onlineAdapter = fs.readFileSync(onlineAdapterPath, "utf8")
if (onlineAdapter.includes("codegen-engine.service")) fail("online-codegen.adapter must import codegen types from infra contract, not the engine service")

const reportSqlPath = path.join(ROOT, "src", "modules", "report", "backend", "services", "custom-sql-report.service.ts")
const reportSql = fs.readFileSync(reportSqlPath, "utf8")
if (reportSql.includes("DataSourceConfigRepository")) fail("report custom-sql must not import infra repository; use infraFacade")
if (!reportSql.includes("infraFacade")) fail("report custom-sql must call data sources through infraFacade")

const reportSqlTestPath = path.join(ROOT, "src", "modules", "report", "backend", "services", "__tests__", "custom-sql-report.service.test.ts")
const reportSqlTest = fs.readFileSync(reportSqlTestPath, "utf8")
if (reportSqlTest.includes("DataSourceConfigRepository")) fail("report custom-sql test must spy infraFacade, not import infra repository")
if (!reportSqlTest.includes("infraFacade")) fail("report custom-sql test must assert infraFacade tenant scope")

const payOrdersPath = path.join(ROOT, "src", "app", "api", "v1", "admin", "pay", "orders", "route.ts")
const payOrders = fs.readFileSync(payOrdersPath, "utf8")
if (!payOrders.includes("PAY_ACTION_SCHEMAS") || !payOrders.includes("parseActionQuery")) {
  fail("pay orders route must parse query with PAY_ACTION_SCHEMAS via parseActionQuery")
}

const payRefundsPath = path.join(ROOT, "src", "app", "api", "v1", "admin", "pay", "refunds", "route.ts")
const payRefunds = fs.readFileSync(payRefundsPath, "utf8")
if (!payRefunds.includes("PAY_ACTION_SCHEMAS") || !payRefunds.includes("parseActionQuery")) {
  fail("pay refunds route must parse query with PAY_ACTION_SCHEMAS via parseActionQuery")
}

const codegenImportPath = path.join(ROOT, "src", "app", "api", "v1", "admin", "infra", "codegen", "import", "route.ts")
const codegenImport = fs.readFileSync(codegenImportPath, "utf8")
if (codegenImport.includes("KyselyOnlineRuntimeRepository") || codegenImport.includes("online-codegen.adapter")) {
  fail("infra codegen import route must not import online Service/Repository/adapter; use onlineFacade")
}
if (!codegenImport.includes("onlineFacade.resolveCodegenImport")) {
  fail("infra codegen import route must call online through onlineFacade.resolveCodegenImport")
}

const onlineDefinitionPath = path.join(ROOT, "src", "modules", "online", "backend", "services", "online-definition.service.ts")
const onlineDefinition = fs.readFileSync(onlineDefinitionPath, "utf8")
if (onlineDefinition.includes("CodegenEngineService")) fail("online-definition must not import CodegenEngineService; use infraFacade")
if (!onlineDefinition.includes("infraFacade")) fail("online-definition must call infra codegen through infraFacade")
if (onlineDefinition.includes("SystemDictService")) fail("online-definition must not import SystemDictService; use systemFacade")
if (!onlineDefinition.includes("systemFacade")) fail("online-definition must call system dict through systemFacade")

const systemMenuRepo = fs.readFileSync(path.join(ROOT, "src", "modules", "system", "backend", "repositories", "menu.repository.ts"), "utf8")
const systemPermissionRepo = fs.readFileSync(path.join(ROOT, "src", "modules", "system", "backend", "repositories", "permission.repository.ts"), "utf8")
const tenantMenuScope = fs.readFileSync(path.join(ROOT, "src", "modules", "system", "backend", "services", "tenant-menu-scope.service.ts"), "utf8")
for (const [name, source] of [["menu.repository", systemMenuRepo], ["permission.repository", systemPermissionRepo], ["tenant-menu-scope", tenantMenuScope]]) {
  if (source.includes("online/backend/menu-catalog")) fail(`${name} must import online menu catalog from contract, not backend`)
}
if (!fs.existsSync(path.join(ROOT, "src", "modules", "online", "contract", "menu-catalog.ts"))) {
  fail("online contract must publish menu-catalog.ts")
}

const codegenEngine = fs.readFileSync(path.join(ROOT, "src", "modules", "infra", "backend", "services", "codegen-engine.service.ts"), "utf8")
if (codegenEngine.includes("KyselyOnlineManagedTableRuntimeRepository")) fail("codegen managed-table template must not import Online repository; use onlineFacade")
if (!codegenEngine.includes("onlineFacade.pageManagedRecords")) fail("codegen managed-table template must call onlineFacade.pageManagedRecords")

const outboxSource = fs.readFileSync(path.join(ROOT, "src", "modules", "shared", "backend", "lib", "transactional-outbox.ts"), "utf8")
if (!outboxSource.includes("getOutboxStoreForDomain")) fail("outbox must expose getOutboxStoreForDomain for per-domain store ownership")

console.log(`[microservice-governance] PASS: ${catalog.capabilities.length} capabilities mapped from Moleculer + NestJS NATS`)
