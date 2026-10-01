// aigw 只保留**核心 AI 网关**能力: 模型注册 / 上游渠道 / 访问令牌 / 用量计量。
// 渠道代理、入驻企业、配额、坐席、资费、分账、结算、发票、SKU、ISV、MCP 资产等
// 属**定制业务**，已按 AGENTS §17.3「基座只建原生域」剥离（应落在衍生的业务工程）。
export { aigwChannelRepository, AigwChannelRepository } from "./aigw-channel.repository"
export { aigwAccessTokenRepository, AigwAccessTokenRepository } from "./aigw-access-token.repository"
export { aigwModelRepository, AigwModelRepository } from "./aigw-model.repository"
export { aigwUsageRepository, AigwUsageRepository } from "./aigw-usage.repository"
