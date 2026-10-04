-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 知识库 (AiKnowledge)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ai-knowledge',
  'ai-dir',
  'AI 知识库管理',
  '/admin/ai/ai-knowledge',
  'ai/ai-knowledge/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_knowledge:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ai-knowledge-query',  'menu-ai-knowledge', '查询AI 知识库', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge:query',  1, NOW(), NOW()),
('menu-ai-knowledge-create', 'menu-ai-knowledge', '新增AI 知识库', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge:create', 2, NOW(), NOW()),
('menu-ai-knowledge-update', 'menu-ai-knowledge', '修改AI 知识库', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge:update', 3, NOW(), NOW()),
('menu-ai-knowledge-delete', 'menu-ai-knowledge', '删除AI 知识库', 'BUTTON', 'ACTIVE', 'ai:ai_knowledge:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ai-knowledge'),
('1', 'menu-ai-knowledge-query'),
('1', 'menu-ai-knowledge-create'),
('1', 'menu-ai-knowledge-update'),
('1', 'menu-ai-knowledge-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ai-knowledge'),
('1', 'menu-ai-knowledge-query'),
('1', 'menu-ai-knowledge-create'),
('1', 'menu-ai-knowledge-update'),
('1', 'menu-ai-knowledge-delete')
ON CONFLICT DO NOTHING;
