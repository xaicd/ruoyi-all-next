-- ============================================================
-- Auto-generated RBAC & Menu Migration for 拼团记录 DO1. 用户参与拼团时，会创建一条记录2. 团长的拼团记录，和参团人 (CombinationRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-combination-record',
  'mall-dir',
  '拼团记录 DO1. 用户参与拼团时，会创建一条记录2. 团长的拼团记录，和参团人管理',
  '/admin/mall/combination-record',
  'mall/combination-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:combination_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-combination-record-query',  'menu-combination-record', '查询拼团记录 DO1. 用户参与拼团时，会创建一条记录2. 团长的拼团记录，和参团人', 'BUTTON', 'ACTIVE', 'mall:combination_record:query',  1, NOW(), NOW()),
('menu-combination-record-create', 'menu-combination-record', '新增拼团记录 DO1. 用户参与拼团时，会创建一条记录2. 团长的拼团记录，和参团人', 'BUTTON', 'ACTIVE', 'mall:combination_record:create', 2, NOW(), NOW()),
('menu-combination-record-update', 'menu-combination-record', '修改拼团记录 DO1. 用户参与拼团时，会创建一条记录2. 团长的拼团记录，和参团人', 'BUTTON', 'ACTIVE', 'mall:combination_record:update', 3, NOW(), NOW()),
('menu-combination-record-delete', 'menu-combination-record', '删除拼团记录 DO1. 用户参与拼团时，会创建一条记录2. 团长的拼团记录，和参团人', 'BUTTON', 'ACTIVE', 'mall:combination_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-combination-record-rm',        '1', 'menu-combination-record'),
('menu-combination-record-rm-query',  '1', 'menu-combination-record-query'),
('menu-combination-record-rm-create', '1', 'menu-combination-record-create'),
('menu-combination-record-rm-update', '1', 'menu-combination-record-update'),
('menu-combination-record-rm-delete', '1', 'menu-combination-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-combination-record-pm',        '1', 'menu-combination-record'),
('menu-combination-record-pm-query',  '1', 'menu-combination-record-query'),
('menu-combination-record-pm-create', '1', 'menu-combination-record-create'),
('menu-combination-record-pm-update', '1', 'menu-combination-record-update'),
('menu-combination-record-pm-delete', '1', 'menu-combination-record-delete')
ON CONFLICT DO NOTHING;
