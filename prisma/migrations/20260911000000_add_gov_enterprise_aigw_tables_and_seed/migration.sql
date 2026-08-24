-- ====================================================================
-- 1. 创建智能体生态与政企资产数据表 (严格遵循 6 大多租户与审计字段规范)
-- ====================================================================

-- 1.1 智能体生态应用表 (ISV Apps)
CREATE TABLE IF NOT EXISTS "aigw_isv_app" (
  "id" VARCHAR(64) PRIMARY KEY,
  "app_code" VARCHAR(64) NOT NULL UNIQUE,
  "app_name" VARCHAR(100) NOT NULL,
  "vendor" VARCHAR(100) NOT NULL,
  "app_type" VARCHAR(30) NOT NULL, -- DESKTOP_IDE | CHAT_ASSISTANT | WORKFLOW_AGENT | OPEN_SOURCE
  "icon" VARCHAR(20) DEFAULT '🤖',
  "version" VARCHAR(30) DEFAULT 'v1.0.0',
  "description" TEXT,
  "default_model" VARCHAR(100) DEFAULT 'deepseek-v3-moma',
  "revenue_share_ratio" NUMERIC(5, 2) DEFAULT 30.00,
  "active_users" INTEGER DEFAULT 0,
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  -- 6 大标准多租户与审计字段
  "tenant_id" VARCHAR(64) DEFAULT '0' NOT NULL,
  "created_by" VARCHAR(64) DEFAULT '',
  "updated_by" VARCHAR(64) DEFAULT '',
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_aigw_isv_tenant_code" ON "aigw_isv_app" ("tenant_id", "app_code");
CREATE INDEX IF NOT EXISTS "idx_aigw_isv_tenant_status" ON "aigw_isv_app" ("tenant_id", "status", "created_at" DESC);

-- 1.2 政企成员手机号授权与份额分配表 (Member Allocations)
CREATE TABLE IF NOT EXISTS "aigw_member_allocation" (
  "id" VARCHAR(64) PRIMARY KEY,
  "tenant_id" VARCHAR(64) DEFAULT '0' NOT NULL,
  "enterprise_name" VARCHAR(100) NOT NULL,
  "department" VARCHAR(100) NOT NULL,
  "member_name" VARCHAR(50) NOT NULL,
  "phone" VARCHAR(20) NOT NULL,
  "monthly_token_cap" BIGINT DEFAULT 10000000,
  "used_tokens" BIGINT DEFAULT 0,
  "allocated_beans" INTEGER DEFAULT 10000,
  "used_beans" INTEGER DEFAULT 0,
  "authorized_apps" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  -- 6 大标准多租户与审计字段
  "created_by" VARCHAR(64) DEFAULT '',
  "updated_by" VARCHAR(64) DEFAULT '',
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_aigw_member_tenant_phone" ON "aigw_member_allocation" ("tenant_id", "phone");
CREATE INDEX IF NOT EXISTS "idx_aigw_member_tenant_status" ON "aigw_member_allocation" ("tenant_id", "status", "created_at" DESC);

-- 1.3 政企私有 MCP 连接器资产表 (Gov MCP Assets)
CREATE TABLE IF NOT EXISTS "aigw_mcp_asset" (
  "id" VARCHAR(64) PRIMARY KEY,
  "mcp_code" VARCHAR(64) NOT NULL UNIQUE,
  "name" VARCHAR(100) NOT NULL,
  "category" VARCHAR(50) NOT NULL,
  "icon" VARCHAR(20) DEFAULT '⚡',
  "version" VARCHAR(30) DEFAULT 'v1.0.0',
  "description" TEXT,
  "endpoint" VARCHAR(255) NOT NULL,
  "authorized_count" INTEGER DEFAULT 0,
  "status" VARCHAR(20) DEFAULT 'ACTIVE',
  "is_official" BOOLEAN DEFAULT true,
  -- 6 大标准多租户与审计字段
  "tenant_id" VARCHAR(64) DEFAULT '0' NOT NULL,
  "created_by" VARCHAR(64) DEFAULT '',
  "updated_by" VARCHAR(64) DEFAULT '',
  "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted" BOOLEAN DEFAULT false NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_aigw_mcp_tenant_code" ON "aigw_mcp_asset" ("tenant_id", "mcp_code");
CREATE INDEX IF NOT EXISTS "idx_aigw_mcp_tenant_status" ON "aigw_mcp_asset" ("tenant_id", "status", "created_at" DESC);

-- ====================================================================
-- 2. 插入政企权威种子数据 (Seed Data)
-- ====================================================================

-- 2.1 插入 ISV 智能体生态
INSERT INTO "aigw_isv_app" ("id", "app_code", "app_name", "vendor", "app_type", "icon", "version", "description", "default_model", "revenue_share_ratio", "active_users", "status", "tenant_id", "created_by", "updated_by", "deleted")
VALUES
  ('app-jiutian-00', 'jiutian-gov', '中移九天数字政府专属助理', '中国移动通信集团 (原生中枢)', 'CHAT_ASSISTANT', '🇨🇳', 'v3.0.0', '中国移动「九天·政务」原生大模型，专为党政机关、公积金、医保热线提供权威政策法规答复与红头公文排版合规审查。', 'jiutian-gov-special', 0.00, 2600, 'ACTIVE', '0', 'admin', 'admin', false),
  ('app-01', 'workbuddy', '腾讯 WorkBuddy (移动企微政务专版)', '腾讯科技 (战略生态 ISV)', 'CHAT_ASSISTANT', '💼', 'v2.8.4', '深度打通企业微信与腾讯文档，内置国家标准公文格式与会议秒级提炼派单，后端消耗移动 MOMA 算力豆与专线账单统付。', 'deepseek-v3-moma', 30.00, 1420, 'ACTIVE', '0', 'admin', 'admin', false),
  ('app-02', 'qoder', '阿里 Qoder (国央企内网研发专版)', '阿里巴巴 (研发信创 ISV)', 'DESKTOP_IDE', '💻', 'v1.12.0', '通义灵码私有化演进版，专为国企信创研发中心提供高安全内网代码审计、Vitest 自动化单测与韶关智算集群算力调度。', 'deepseek-r1-moma', 35.00, 980, 'ACTIVE', '0', 'admin', 'admin', false),
  ('app-03', 'trae', '字节 Trae (政企应急指挥工作流)', '北京字跳网络 (流程协同 ISV)', 'WORKFLOW_AGENT', '⚡', 'v1.4.2', '飞书多维表格与跨部门审批智能编排，秒级处理 12345 市民热线诉求与应急指挥协同派发，专线直连中移智算专网。', 'deepseek-v3-moma', 25.00, 650, 'ACTIVE', '0', 'admin', 'admin', false),
  ('app-04', 'cherry-studio', 'Cherry Studio (中移专区 BYOK 客户端)', '开源社区 (BYOK 生态)', 'OPEN_SOURCE', '🍒', 'v0.9.8', '政企员工免登录一键下发中移专属 API Key，直接挂载私有 MCP 工具库，支持端侧高并发本地调度。', 'deepseek-r1-moma', 0.00, 3100, 'ACTIVE', '0', 'admin', 'admin', false)
ON CONFLICT ("id") DO UPDATE SET
  "app_name" = EXCLUDED."app_name",
  "vendor" = EXCLUDED."vendor",
  "description" = EXCLUDED."description",
  "default_model" = EXCLUDED."default_model",
  "status" = EXCLUDED."status",
  "updated_at" = CURRENT_TIMESTAMP;

-- 2.2 插入政企成员手机号与份额分配
INSERT INTO "aigw_member_allocation" ("id", "tenant_id", "enterprise_name", "department", "member_name", "phone", "monthly_token_cap", "used_tokens", "allocated_beans", "used_beans", "authorized_apps", "status", "created_by", "updated_by", "deleted")
VALUES
  ('mem-01', 'gd-gov-data', '广东省政务服务和数据管理局', '数智推进处', '李总 (信息化处长)', '13800000001', 20000000, 4250000, 20000, 4250, ARRAY['workbuddy', 'cherry-studio'], 'ACTIVE', 'admin', 'admin', false),
  ('mem-02', 'yue-transport-tech', '广东省交通数智科技集团', '核心研发中心', '张工 (首席架构师)', '13911112222', 30000000, 8920000, 30000, 8920, ARRAY['qoder', 'trae'], 'ACTIVE', 'admin', 'admin', false),
  ('mem-03', 'gz-digital-gov', '广州市数字政府运营中心', '综合行政办', '王主任 (行政主任)', '13766668888', 10000000, 1850000, 10000, 1850, ARRAY['workbuddy'], 'ACTIVE', 'admin', 'admin', false),
  ('mem-04', 'sz-housing-fund', '深圳市住房公积金管理中心', '法规政策科', '陈科长 (科长)', '13600009999', 15000000, 3100000, 15000, 3100, ARRAY['workbuddy'], 'ACTIVE', 'admin', 'admin', false),
  ('mem-05', 'chinamobile-gd', '中国移动通信集团广东有限公司', '政企客户部', '林经理 (大客户经理)', '13588886666', 50000000, 12600000, 50000, 12600, ARRAY['workbuddy', 'qoder'], 'ACTIVE', 'admin', 'admin', false)
ON CONFLICT ("id") DO UPDATE SET
  "member_name" = EXCLUDED."member_name",
  "monthly_token_cap" = EXCLUDED."monthly_token_cap",
  "allocated_beans" = EXCLUDED."allocated_beans",
  "authorized_apps" = EXCLUDED."authorized_apps",
  "status" = EXCLUDED."status",
  "updated_at" = CURRENT_TIMESTAMP;

-- 2.3 插入政企私有 MCP 资产
INSERT INTO "aigw_mcp_asset" ("id", "mcp_code", "name", "category", "icon", "version", "description", "endpoint", "authorized_count", "status", "is_official", "tenant_id", "created_by", "updated_by", "deleted")
VALUES
  ('mcp-01', 'mcp-gov-document', '国家标准红头公文排版与合规审查 MCP', 'GOV_DOC', '📕', 'v2.6.0', '内置《党政机关公文格式》(GB/T 9704-2012) 国家标准，排查涉密与政策合规风险。', 'http://127.0.0.1:8090/mcp/gov-doc/sse', 45, 'ACTIVE', true, '0', 'admin', 'admin', false),
  ('mcp-02', 'mcp-meeting-wework', '腾讯会议速记与企业微信待办任务派发 MCP', 'MEETING_OA', '🎙️', 'v1.8.4', '2小时长会议录音秒级提炼核心决议，自动拆解责任人并调用企微机器人推送待办。', 'http://127.0.0.1:8090/mcp/meeting-wework/sse', 38, 'ACTIVE', true, '0', 'admin', 'admin', false),
  ('mcp-03', 'mcp-bidding-audit', '政府采购与招投标方案比对审查 MCP', 'BIDDING', '📊', 'v3.1.0', '批量解析 PDF 标书，自动生成技术规格响应与报价对比矩阵表，识别废标风险。', 'http://127.0.0.1:8090/mcp/bidding/sse', 22, 'ACTIVE', true, '0', 'admin', 'admin', false),
  ('mcp-04', 'mcp-gitlab-audit', '国央企内网 GitLab 源码安全审计与单测 MCP', 'DEV_SECURITY', '💻', 'v2.4.1', '内网沙箱运行，排查高并发竞态条件与 SQL 注入漏洞，补齐 Vitest 单元测试。', 'http://127.0.0.1:8090/mcp/code-audit/sse', 29, 'ACTIVE', true, '0', 'admin', 'admin', false),
  ('mcp-05', 'mcp-12345-hotline', '12345 市民热线工单智能分类与政策答复 MCP', 'HOTLINE', '🏛️', 'v1.5.0', '秒级识别加装电梯、公积金补贴诉求，调取最新法规答复口径并派单至责任科室。', 'http://127.0.0.1:8090/mcp/12345/sse', 16, 'ACTIVE', true, '0', 'admin', 'admin', false)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "endpoint" = EXCLUDED."endpoint",
  "status" = EXCLUDED."status",
  "updated_at" = CURRENT_TIMESTAMP;

-- ====================================================================
-- 3. 注册 4 汉字标准系统菜单与租户套餐授权
-- ====================================================================

INSERT INTO "system_menu" ("id", "name", "permission", "type", "parent_id", "path", "component", "icon", "sort", "status", "visible", "keep_alive", "created_at", "updated_at", "deleted")
VALUES
  ('aigw-dir', '模型中台', 'aigw:channel:view', 'DIR', NULL, '/admin/aigw', NULL, 'ep:aim', 14, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-routing-dir', '算力中枢', 'aigw:channel:view', 'DIR', 'aigw-dir', 'routing', NULL, 'ep:guide', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-workbench', '体验中心', 'aigw:usage:view', 'MENU', 'aigw-routing-dir', 'workbench', 'aigw/workbench/index', 'ep:service', 0, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-dashboard', '监控大屏', 'aigw:usage:view', 'MENU', 'aigw-routing-dir', 'dashboard', 'aigw/dashboard/index', 'ep:data-analysis', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-channels', '上游渠道', 'aigw:channel:view', 'MENU', 'aigw-routing-dir', 'channels', 'aigw/channels/index', 'ep:connection', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-isv-apps', '应用生态', 'aigw:channel:view', 'MENU', 'aigw-routing-dir', 'isv-apps', 'aigw/isv-apps/index', 'ep:app', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-mcp-hub', '私有工具', 'aigw:channel:view', 'MENU', 'aigw-routing-dir', 'mcp-hub', 'aigw/mcp-hub/index', 'ep:cpu', 4, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-models', '模型目录', 'aigw:model:view', 'MENU', 'aigw-routing-dir', 'models', 'aigw/models/index', 'ep:collection', 5, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-tokens', '调用令牌', 'aigw:token:view', 'MENU', 'aigw-routing-dir', 'tokens', 'aigw/tokens/index', 'fa:key', 6, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-usages', '用量日志', 'aigw:usage:view', 'MENU', 'aigw-routing-dir', 'usages', 'aigw/usages/index', 'fa:tasks', 7, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-playground', '联调探测', 'aigw:playground:view', 'MENU', 'aigw-routing-dir', 'playground', 'aigw/playground/index', 'ep:monitor', 8, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-chats', '对话记录', 'aigw:chat:view', 'MENU', 'aigw-routing-dir', 'chats', 'aigw/chats/index', 'ep:message', 9, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-identity-dir', '政企门户', 'entitlement:enterprise:query', 'DIR', 'aigw-dir', 'identity', NULL, 'ep:avatar', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-tenant-members', '成员份额', 'entitlement:enterprise:query', 'MENU', 'aigw-identity-dir', 'tenant-members', 'aigw/tenant-members/index', 'ep:user', 0, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-enterprises', '算力开户', 'entitlement:enterprise:query', 'MENU', 'aigw-identity-dir', 'enterprises', 'aigw/enterprises/index', 'ep:office-building', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-tariff-dir', '资费规则', 'meter:tariff:query', 'DIR', 'aigw-dir', 'tariff', NULL, 'ep:goods', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-tariffs', '阶梯资费', 'meter:tariff:query', 'MENU', 'aigw-tariff-dir', 'tariffs', 'aigw/tariffs/index', 'ep:price-tag', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-settlement-dir', '清分结算', 'split:pipeline:query', 'DIR', 'aigw-dir', 'settlement', NULL, 'ep:document', 4, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-pipelines', '清分流水', 'split:pipeline:query', 'MENU', 'aigw-settlement-dir', 'pipelines', 'aigw/pipelines/index', 'ep:help', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-contracts', '合同账务', 'settlement:contract:query', 'MENU', 'aigw-settlement-dir', 'contracts', 'aigw/contracts/index', 'ep:files', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('aigw-invoices', '发票管理', 'settlement:invoice:query', 'MENU', 'aigw-settlement-dir', 'invoices', 'aigw/invoices/index', 'ep:wallet', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "component" = EXCLUDED."component",
  "path" = EXCLUDED."path",
  "status" = 'ACTIVE',
  "visible" = true,
  "deleted" = false;
