-- ============================================================
-- Auto-generated RBAC & Menu Migration for AiKnowledgeSegment（源框架导入） (AiKnowledgeSegment)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ai-knowledge-segment',
  'ai-dir',
  'AiKnowledgeSegment（源框架导入）管理',
  '/admin/ai/ai-knowledge-segment',
  'ai/ai-knowledge-segment/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_knowledge_segment:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ai-knowledge-segment-query',  'menu-ai-knowledge-segment', '查询AiKnowledgeSegment（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_segment:query',  1, NOW(), NOW()),
('menu-ai-knowledge-segment-create', 'menu-ai-knowledge-segment', '新增AiKnowledgeSegment（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_segment:create', 2, NOW(), NOW()),
('menu-ai-knowledge-segment-update', 'menu-ai-knowledge-segment', '修改AiKnowledgeSegment（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_segment:update', 3, NOW(), NOW()),
('menu-ai-knowledge-segment-delete', 'menu-ai-knowledge-segment', '删除AiKnowledgeSegment（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_segment:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ai-knowledge-segment'),
('1', 'menu-ai-knowledge-segment-query'),
('1', 'menu-ai-knowledge-segment-create'),
('1', 'menu-ai-knowledge-segment-update'),
('1', 'menu-ai-knowledge-segment-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ai-knowledge-segment'),
('1', 'menu-ai-knowledge-segment-query'),
('1', 'menu-ai-knowledge-segment-create'),
('1', 'menu-ai-knowledge-segment-update'),
('1', 'menu-ai-knowledge-segment-delete')
ON CONFLICT DO NOTHING;
