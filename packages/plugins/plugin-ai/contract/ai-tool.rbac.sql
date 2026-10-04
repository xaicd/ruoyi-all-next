-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 工具 (AiTool)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ai-tool',
  'ai-dir',
  'AI 工具管理',
  '/admin/ai/ai-tool',
  'ai/ai-tool/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_tool:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ai-tool-query',  'menu-ai-tool', '查询AI 工具', 'BUTTON', 'ACTIVE', 'ai:ai_tool:query',  1, NOW(), NOW()),
('menu-ai-tool-create', 'menu-ai-tool', '新增AI 工具', 'BUTTON', 'ACTIVE', 'ai:ai_tool:create', 2, NOW(), NOW()),
('menu-ai-tool-update', 'menu-ai-tool', '修改AI 工具', 'BUTTON', 'ACTIVE', 'ai:ai_tool:update', 3, NOW(), NOW()),
('menu-ai-tool-delete', 'menu-ai-tool', '删除AI 工具', 'BUTTON', 'ACTIVE', 'ai:ai_tool:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ai-tool'),
('1', 'menu-ai-tool-query'),
('1', 'menu-ai-tool-create'),
('1', 'menu-ai-tool-update'),
('1', 'menu-ai-tool-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ai-tool'),
('1', 'menu-ai-tool-query'),
('1', 'menu-ai-tool-create'),
('1', 'menu-ai-tool-update'),
('1', 'menu-ai-tool-delete')
ON CONFLICT DO NOTHING;
