-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 思维导图 (AiMindMap)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ai-mind-map',
  'ai-dir',
  'AI 思维导图管理',
  '/admin/ai/ai-mind-map',
  'ai/ai-mind-map/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_mind_map:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ai-mind-map-query',  'menu-ai-mind-map', '查询AI 思维导图', 'BUTTON', 'ACTIVE', 'ai:ai_mind_map:query',  1, NOW(), NOW()),
('menu-ai-mind-map-create', 'menu-ai-mind-map', '新增AI 思维导图', 'BUTTON', 'ACTIVE', 'ai:ai_mind_map:create', 2, NOW(), NOW()),
('menu-ai-mind-map-update', 'menu-ai-mind-map', '修改AI 思维导图', 'BUTTON', 'ACTIVE', 'ai:ai_mind_map:update', 3, NOW(), NOW()),
('menu-ai-mind-map-delete', 'menu-ai-mind-map', '删除AI 思维导图', 'BUTTON', 'ACTIVE', 'ai:ai_mind_map:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ai-mind-map'),
('1', 'menu-ai-mind-map-query'),
('1', 'menu-ai-mind-map-create'),
('1', 'menu-ai-mind-map-update'),
('1', 'menu-ai-mind-map-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ai-mind-map'),
('1', 'menu-ai-mind-map-query'),
('1', 'menu-ai-mind-map-create'),
('1', 'menu-ai-mind-map-update'),
('1', 'menu-ai-mind-map-delete')
ON CONFLICT DO NOTHING;
