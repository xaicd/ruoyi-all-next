-- ============================================================
-- Auto-generated RBAC & Menu Migration for 积分商城活动 (PointActivity)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-point-activity',
  'mall-dir',
  '积分商城活动管理',
  '/admin/mall/point-activity',
  'mall/point-activity/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:point_activity:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-point-activity-query',  'menu-point-activity', '查询积分商城活动', 'BUTTON', 'ACTIVE', 'mall:point_activity:query',  1, NOW(), NOW()),
('menu-point-activity-create', 'menu-point-activity', '新增积分商城活动', 'BUTTON', 'ACTIVE', 'mall:point_activity:create', 2, NOW(), NOW()),
('menu-point-activity-update', 'menu-point-activity', '修改积分商城活动', 'BUTTON', 'ACTIVE', 'mall:point_activity:update', 3, NOW(), NOW()),
('menu-point-activity-delete', 'menu-point-activity', '删除积分商城活动', 'BUTTON', 'ACTIVE', 'mall:point_activity:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-point-activity-rm',        '1', 'menu-point-activity'),
('menu-point-activity-rm-query',  '1', 'menu-point-activity-query'),
('menu-point-activity-rm-create', '1', 'menu-point-activity-create'),
('menu-point-activity-rm-update', '1', 'menu-point-activity-update'),
('menu-point-activity-rm-delete', '1', 'menu-point-activity-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-point-activity-pm',        '1', 'menu-point-activity'),
('menu-point-activity-pm-query',  '1', 'menu-point-activity-query'),
('menu-point-activity-pm-create', '1', 'menu-point-activity-create'),
('menu-point-activity-pm-update', '1', 'menu-point-activity-update'),
('menu-point-activity-pm-delete', '1', 'menu-point-activity-delete')
ON CONFLICT DO NOTHING;
