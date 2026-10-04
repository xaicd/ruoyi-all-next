-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI API 秘钥 (AiApiKey)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-ai-api-key',
  'ai-dir',
  'AI API 秘钥管理',
  '/admin/ai/ai-api-key',
  'ai/ai-api-key/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_api_key:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-ai-api-key-query',  'menu-ai-api-key', '查询AI API 秘钥', 'BUTTON', 'ACTIVE', 'ai:ai_api_key:query',  1, NOW(), NOW()),
('menu-ai-api-key-create', 'menu-ai-api-key', '新增AI API 秘钥', 'BUTTON', 'ACTIVE', 'ai:ai_api_key:create', 2, NOW(), NOW()),
('menu-ai-api-key-update', 'menu-ai-api-key', '修改AI API 秘钥', 'BUTTON', 'ACTIVE', 'ai:ai_api_key:update', 3, NOW(), NOW()),
('menu-ai-api-key-delete', 'menu-ai-api-key', '删除AI API 秘钥', 'BUTTON', 'ACTIVE', 'ai:ai_api_key:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-ai-api-key-rm',        '1', 'menu-ai-api-key'),
('menu-ai-api-key-rm-query',  '1', 'menu-ai-api-key-query'),
('menu-ai-api-key-rm-create', '1', 'menu-ai-api-key-create'),
('menu-ai-api-key-rm-update', '1', 'menu-ai-api-key-update'),
('menu-ai-api-key-rm-delete', '1', 'menu-ai-api-key-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-ai-api-key-pm',        '1', 'menu-ai-api-key'),
('menu-ai-api-key-pm-query',  '1', 'menu-ai-api-key-query'),
('menu-ai-api-key-pm-create', '1', 'menu-ai-api-key-create'),
('menu-ai-api-key-pm-update', '1', 'menu-ai-api-key-update'),
('menu-ai-api-key-pm-delete', '1', 'menu-ai-api-key-delete')
ON CONFLICT DO NOTHING;
