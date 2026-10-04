-- ============================================================
-- Auto-generated RBAC & Menu Migration for OA 请假申请 DO 请假天数，目前先简单做。一般是分成请假上午和下午，可以是 1 整天，可以是 0.5 半天 (BpmOALeave)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-bpm-oaleave',
  'bpm-dir',
  'OA 请假申请 DO 请假天数，目前先简单做。一般是分成请假上午和下午，可以是 1 整天，可以是 0.5 半天管理',
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
('menu-bpm-oaleave-query',  'menu-bpm-oaleave', '查询OA 请假申请 DO 请假天数，目前先简单做。一般是分成请假上午和下午，可以是 1 整天，可以是 0.5 半天', 'BUTTON', 'ACTIVE', 'bpm:bpm_oaleave:query',  1, NOW(), NOW()),
('menu-bpm-oaleave-create', 'menu-bpm-oaleave', '新增OA 请假申请 DO 请假天数，目前先简单做。一般是分成请假上午和下午，可以是 1 整天，可以是 0.5 半天', 'BUTTON', 'ACTIVE', 'bpm:bpm_oaleave:create', 2, NOW(), NOW()),
('menu-bpm-oaleave-update', 'menu-bpm-oaleave', '修改OA 请假申请 DO 请假天数，目前先简单做。一般是分成请假上午和下午，可以是 1 整天，可以是 0.5 半天', 'BUTTON', 'ACTIVE', 'bpm:bpm_oaleave:update', 3, NOW(), NOW()),
('menu-bpm-oaleave-delete', 'menu-bpm-oaleave', '删除OA 请假申请 DO 请假天数，目前先简单做。一般是分成请假上午和下午，可以是 1 整天，可以是 0.5 半天', 'BUTTON', 'ACTIVE', 'bpm:bpm_oaleave:delete', 4, NOW(), NOW())
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
