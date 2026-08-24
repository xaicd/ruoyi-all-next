-- ============================================================
-- 1. 清理非中国移动渠道
-- ============================================================
DELETE FROM "ai_channel" WHERE "id" IN ('ch-ctyun-003', 'ch-unicom-004', 'ch-openai-003', 'ch-mock-004');

-- ============================================================
-- 2. 插入中国移动自营智算中枢与九天大模型渠道 (置顶优先调度)
-- ============================================================
INSERT INTO "ai_channel" ("id", "name", "provider", "base_url", "api_key", "models", "model_map", "weight", "priority", "status", "auto_disable", "fail_count", "protocol", "tenant_id", "created_at", "updated_at", "deleted")
VALUES
  ('ch-moma-gz-001', '中国移动 MOMA 智算中心 (广州天河核心区)', 'CHINA_MOBILE_MOMA', 'https://moma.10086.cn/api/v1', 'sk-moma-carrier-master-key', '["deepseek-r1-moma", "deepseek-v3-moma", "jiutian-72b", "qwen2.5-72b"]', '{"deepseek-reasoner": "deepseek-r1-moma", "deepseek-chat": "deepseek-v3-moma"}', 100, 100, 'ACTIVE', true, 0, 'openai', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ch-moma-sg-002', '中国移动 MOMA 智算中心 (韶关国家集群)', 'CHINA_MOBILE_MOMA', 'https://sg-moma.10086.cn/api/v1', 'sk-moma-shaoguan-key', '["deepseek-r1-moma", "deepseek-v3-moma", "jiutian-vision-72b"]', '{"deepseek-reasoner": "deepseek-r1-moma", "deepseek-chat": "deepseek-v3-moma"}', 90, 90, 'ACTIVE', true, 0, 'openai', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ch-moma-jiutian-003', '中国移动「九天」人工智能大模型专区', 'CHINA_MOBILE_JIUTIAN', 'https://jiutian.10086.cn/v1', 'sk-moma-jiutian-key', '["jiutian-72b", "jiutian-vision-72b", "jiutian-gov-special"]', '{}', 80, 80, 'ACTIVE', true, 0, 'openai', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ch-deepseek-005', 'DeepSeek 官方直连渠道 (备份兜底)', 'DEEPSEEK', 'https://api.deepseek.com/v1', 'sk-mock-deepseek-key', '["deepseek-chat", "deepseek-reasoner", "deepseek-coder"]', '{}', 50, 50, 'ACTIVE', true, 0, 'openai', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ch-qwen-006', '通义千问 (DashScope) 外部生态渠道', 'TONGYI', 'https://dashscope.aliyuncs.com/compatible-mode/v1', 'sk-mock-dashscope-key', '["qwen-plus", "qwen-max", "qwen-turbo", "qwen2.5-72b-instruct"]', '{}', 40, 40, 'ACTIVE', true, 0, 'openai', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "provider" = EXCLUDED."provider",
  "base_url" = EXCLUDED."base_url",
  "models" = EXCLUDED."models",
  "model_map" = EXCLUDED."model_map",
  "weight" = EXCLUDED."weight",
  "priority" = EXCLUDED."priority",
  "status" = 'ACTIVE',
  "deleted" = false,
  "updated_at" = CURRENT_TIMESTAMP;
