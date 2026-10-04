-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 写作 (AiWrite)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-ai-write',
  'ai-dir',
  'AI 写作管理',
  '/admin/ai/ai-write',
  'ai/ai-write/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_write:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-ai-write-query',  'menu-ai-write', '查询AI 写作', 'BUTTON', 'ACTIVE', 'ai:ai_write:query',  1, NOW(), NOW()),
('menu-ai-write-create', 'menu-ai-write', '新增AI 写作', 'BUTTON', 'ACTIVE', 'ai:ai_write:create', 2, NOW(), NOW()),
('menu-ai-write-update', 'menu-ai-write', '修改AI 写作', 'BUTTON', 'ACTIVE', 'ai:ai_write:update', 3, NOW(), NOW()),
('menu-ai-write-delete', 'menu-ai-write', '删除AI 写作', 'BUTTON', 'ACTIVE', 'ai:ai_write:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-ai-write-rm',        '1', 'menu-ai-write'),
('menu-ai-write-rm-query',  '1', 'menu-ai-write-query'),
('menu-ai-write-rm-create', '1', 'menu-ai-write-create'),
('menu-ai-write-rm-update', '1', 'menu-ai-write-update'),
('menu-ai-write-rm-delete', '1', 'menu-ai-write-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-ai-write-pm',        '1', 'menu-ai-write'),
('menu-ai-write-pm-query',  '1', 'menu-ai-write-query'),
('menu-ai-write-pm-create', '1', 'menu-ai-write-create'),
('menu-ai-write-pm-update', '1', 'menu-ai-write-update'),
('menu-ai-write-pm-delete', '1', 'menu-ai-write-delete')
ON CONFLICT DO NOTHING;
