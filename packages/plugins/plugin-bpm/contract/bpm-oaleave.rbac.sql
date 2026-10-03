-- ============================================================
-- Auto-generated RBAC & Menu Migration for BpmOALeave（源框架导入） (BpmOALeave)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-bpm-oaleave',
  'bpm-dir',
  'BpmOALeave（源框架导入）管理',
  '/admin/bpm/bpm-oaleave',
  'bpm/bpm-oaleave/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'bpm:bpm_oaleave:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-bpm-oaleave-query',  'menu-bpm-oaleave', '查询BpmOALeave（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_oaleave:query',  1, NOW(), NOW()),
('menu-bpm-oaleave-create', 'menu-bpm-oaleave', '新增BpmOALeave（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_oaleave:create', 2, NOW(), NOW()),
('menu-bpm-oaleave-update', 'menu-bpm-oaleave', '修改BpmOALeave（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_oaleave:update', 3, NOW(), NOW()),
('menu-bpm-oaleave-delete', 'menu-bpm-oaleave', '删除BpmOALeave（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_oaleave:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-bpm-oaleave'),
('1', 'menu-bpm-oaleave-query'),
('1', 'menu-bpm-oaleave-create'),
('1', 'menu-bpm-oaleave-update'),
('1', 'menu-bpm-oaleave-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-bpm-oaleave'),
('1', 'menu-bpm-oaleave-query'),
('1', 'menu-bpm-oaleave-create'),
('1', 'menu-bpm-oaleave-update'),
('1', 'menu-bpm-oaleave-delete')
ON CONFLICT DO NOTHING;
