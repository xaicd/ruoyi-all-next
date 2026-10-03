-- ============================================================
-- Auto-generated RBAC & Menu Migration for AiApiKey（源框架导入） (AiApiKey)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ai-api-key',
  'ai-dir',
  'AiApiKey（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ai-api-key-query',  'menu-ai-api-key', '查询AiApiKey（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_api_key:query',  1, NOW(), NOW()),
('menu-ai-api-key-create', 'menu-ai-api-key', '新增AiApiKey（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_api_key:create', 2, NOW(), NOW()),
('menu-ai-api-key-update', 'menu-ai-api-key', '修改AiApiKey（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_api_key:update', 3, NOW(), NOW()),
('menu-ai-api-key-delete', 'menu-ai-api-key', '删除AiApiKey（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_api_key:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ai-api-key'),
('1', 'menu-ai-api-key-query'),
('1', 'menu-ai-api-key-create'),
('1', 'menu-ai-api-key-update'),
('1', 'menu-ai-api-key-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ai-api-key'),
('1', 'menu-ai-api-key-query'),
('1', 'menu-ai-api-key-create'),
('1', 'menu-ai-api-key-update'),
('1', 'menu-ai-api-key-delete')
ON CONFLICT DO NOTHING;
