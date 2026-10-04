-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 音乐 (AiMusic)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ai-music',
  'ai-dir',
  'AI 音乐管理',
  '/admin/ai/ai-music',
  'ai/ai-music/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_music:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ai-music-query',  'menu-ai-music', '查询AI 音乐', 'BUTTON', 'ACTIVE', 'ai:ai_music:query',  1, NOW(), NOW()),
('menu-ai-music-create', 'menu-ai-music', '新增AI 音乐', 'BUTTON', 'ACTIVE', 'ai:ai_music:create', 2, NOW(), NOW()),
('menu-ai-music-update', 'menu-ai-music', '修改AI 音乐', 'BUTTON', 'ACTIVE', 'ai:ai_music:update', 3, NOW(), NOW()),
('menu-ai-music-delete', 'menu-ai-music', '删除AI 音乐', 'BUTTON', 'ACTIVE', 'ai:ai_music:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ai-music'),
('1', 'menu-ai-music-query'),
('1', 'menu-ai-music-create'),
('1', 'menu-ai-music-update'),
('1', 'menu-ai-music-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ai-music'),
('1', 'menu-ai-music-query'),
('1', 'menu-ai-music-create'),
('1', 'menu-ai-music-update'),
('1', 'menu-ai-music-delete')
ON CONFLICT DO NOTHING;
