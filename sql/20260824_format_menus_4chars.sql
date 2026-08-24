-- ==============================================================================
-- 工整化 4 字符菜单名称迁移与持久化脚本 (2026-08-24)
-- 作用：将系统管理、基础设施、AI 应用、模型中台所有菜单统一调整为工整的 4 个汉字
-- ==============================================================================

-- 1. AI 智汇应用域
UPDATE system_menu SET name = '智汇应用' WHERE name IN ('AI 智汇应用', 'AI智汇应用', '智汇应用') OR path = '/admin/ai';
UPDATE system_menu SET name = '智能角色' WHERE name IN ('角色智能体', '角色设定') OR path = 'ai-chat-role';
UPDATE system_menu SET name = '知识库群' WHERE name IN ('知识库 (RAG)', '知识库(RAG)', '知识库') OR path = 'ai-knowledge';
UPDATE system_menu SET name = '智能绘画' WHERE name IN ('AI 绘画', 'AI绘画') OR path = 'ai-image';
UPDATE system_menu SET name = '智能思维' WHERE name IN ('AI 脑图', 'AI脑图') OR path = 'ai-mind-map';
UPDATE system_menu SET name = '智能创作' WHERE name IN ('AI 写作', 'AI写作') OR path = 'ai-write';
UPDATE system_menu SET name = '流程编排' WHERE name IN ('工作流编排', '工作流') OR path = 'ai-workflow';

-- 2. 基础设施与低代码域
UPDATE system_menu SET name = '在线建模' WHERE name IN ('业务建模（Online）', '业务建模', 'Online 代码生成', 'Online代码生成') OR path = 'online-definitions';
UPDATE system_menu SET name = '动态报表' WHERE name IN ('AUTO报表', 'AUTO 报表') OR path = 'online-test';
UPDATE system_menu SET name = '数据源库' WHERE name = '数据源配置' OR path = 'db-configs';
UPDATE system_menu SET name = '代码生成' WHERE name IN ('代码生成（存量表）', '代码生成') AND path = 'codegen';
UPDATE system_menu SET name = '接口文档' WHERE name IN ('系统接口', 'API 接口', 'API接口', 'Swagger接口') OR path = 'swagger';
UPDATE system_menu SET name = '缓存监控' WHERE name IN ('Redis 监控', 'Redis监控') OR path = 'redis';
UPDATE system_menu SET name = '访问日志' WHERE name IN ('API 日志', 'API日志', 'API 访问日志') OR path = 'api-access-log';
UPDATE system_menu SET name = '错误日志' WHERE name IN ('API 错误日志', '错误日志') OR path = 'api-error-logs';
UPDATE system_menu SET name = '长链消息' WHERE name IN ('WebSocket', 'Websocket') OR path = 'websocket';
UPDATE system_menu SET name = '库表监控' WHERE name IN ('MySQL 监控', 'MySQL监控');
UPDATE system_menu SET name = '服务监控' WHERE name IN ('Java 监控', 'Java监控');

-- 3. 系统管理域
UPDATE system_menu SET name = '授权应用' WHERE name IN ('OAuth2 客户端', 'OAuth2客户端', 'OAuth 2.0') OR path = 'oauth2-clients';
UPDATE system_menu SET name = '授权令牌' WHERE name IN ('OAuth2 令牌', 'OAuth2令牌') OR path = 'oauth2-tokens';
UPDATE system_menu SET name = '地区管理' WHERE name IN ('IP 属地', 'IP属地', 'IP区域') OR path = 'ip-areas';

-- 4. 业务与模型中台域
UPDATE system_menu SET name = '微信公号' WHERE name = '公众号中心';
UPDATE system_menu SET name = '账号管理' WHERE name = '公众号账号';
UPDATE system_menu SET name = '商品管理' WHERE name = 'ERP商品';
UPDATE system_menu SET name = '订单管理' WHERE name = 'ERP订单';
UPDATE system_menu SET name = '退款单据' WHERE name = '退款单';
UPDATE system_menu SET name = '物联中台' WHERE name = 'IoT中台';
UPDATE system_menu SET name = '生态应用' WHERE name = '应用生态' AND path = 'isv-apps';
UPDATE system_menu SET name = '联调沙箱' WHERE name = '客户端沙箱' OR path = 'agent-sandbox';
UPDATE system_menu SET name = '渠道门户' WHERE name = '代理商工作台' OR path = 'partner-portal';
UPDATE system_menu SET name = '代理商户' WHERE name = '渠道代理商' OR path = 'aigw-partner';
UPDATE system_menu SET name = '商机报备' WHERE name = '商机报备锁定' OR path = 'aigw-partner-lead';
