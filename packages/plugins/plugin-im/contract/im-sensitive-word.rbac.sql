-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 敏感词 (ImSensitiveWord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-im-sensitive-word',
  'im-dir',
  'IM 敏感词管理',
  '/admin/im/im-sensitive-word',
  'im/im-sensitive-word/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_sensitive_word:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-im-sensitive-word-query',  'menu-im-sensitive-word', '查询IM 敏感词', 'BUTTON', 'ACTIVE', 'im:im_sensitive_word:query',  1, NOW(), NOW()),
('menu-im-sensitive-word-create', 'menu-im-sensitive-word', '新增IM 敏感词', 'BUTTON', 'ACTIVE', 'im:im_sensitive_word:create', 2, NOW(), NOW()),
('menu-im-sensitive-word-update', 'menu-im-sensitive-word', '修改IM 敏感词', 'BUTTON', 'ACTIVE', 'im:im_sensitive_word:update', 3, NOW(), NOW()),
('menu-im-sensitive-word-delete', 'menu-im-sensitive-word', '删除IM 敏感词', 'BUTTON', 'ACTIVE', 'im:im_sensitive_word:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-im-sensitive-word-rm',        '1', 'menu-im-sensitive-word'),
('menu-im-sensitive-word-rm-query',  '1', 'menu-im-sensitive-word-query'),
('menu-im-sensitive-word-rm-create', '1', 'menu-im-sensitive-word-create'),
('menu-im-sensitive-word-rm-update', '1', 'menu-im-sensitive-word-update'),
('menu-im-sensitive-word-rm-delete', '1', 'menu-im-sensitive-word-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-im-sensitive-word-pm',        '1', 'menu-im-sensitive-word'),
('menu-im-sensitive-word-pm-query',  '1', 'menu-im-sensitive-word-query'),
('menu-im-sensitive-word-pm-create', '1', 'menu-im-sensitive-word-create'),
('menu-im-sensitive-word-pm-update', '1', 'menu-im-sensitive-word-update'),
('menu-im-sensitive-word-pm-delete', '1', 'menu-im-sensitive-word-delete')
ON CONFLICT DO NOTHING;
