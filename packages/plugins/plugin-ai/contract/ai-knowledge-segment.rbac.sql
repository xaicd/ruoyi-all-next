-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 知识库-文档分段 (AiKnowledgeSegment)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-ai-knowledge-segment',
  'ai-dir',
  'AI 知识库-文档分段管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-ai-knowledge-segment-query',  'menu-ai-knowledge-segment', '查询AI 知识库-文档分段', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_segment:query',  1, NOW(), NOW()),
('menu-ai-knowledge-segment-create', 'menu-ai-knowledge-segment', '新增AI 知识库-文档分段', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_segment:create', 2, NOW(), NOW()),
('menu-ai-knowledge-segment-update', 'menu-ai-knowledge-segment', '修改AI 知识库-文档分段', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_segment:update', 3, NOW(), NOW()),
('menu-ai-knowledge-segment-delete', 'menu-ai-knowledge-segment', '删除AI 知识库-文档分段', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge_segment:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-ai-knowledge-segment-rm',        '1', 'menu-ai-knowledge-segment'),
('menu-ai-knowledge-segment-rm-query',  '1', 'menu-ai-knowledge-segment-query'),
('menu-ai-knowledge-segment-rm-create', '1', 'menu-ai-knowledge-segment-create'),
('menu-ai-knowledge-segment-rm-update', '1', 'menu-ai-knowledge-segment-update'),
('menu-ai-knowledge-segment-rm-delete', '1', 'menu-ai-knowledge-segment-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-ai-knowledge-segment-pm',        '1', 'menu-ai-knowledge-segment'),
('menu-ai-knowledge-segment-pm-query',  '1', 'menu-ai-knowledge-segment-query'),
('menu-ai-knowledge-segment-pm-create', '1', 'menu-ai-knowledge-segment-create'),
('menu-ai-knowledge-segment-pm-update', '1', 'menu-ai-knowledge-segment-update'),
('menu-ai-knowledge-segment-pm-delete', '1', 'menu-ai-knowledge-segment-delete')
ON CONFLICT DO NOTHING;
