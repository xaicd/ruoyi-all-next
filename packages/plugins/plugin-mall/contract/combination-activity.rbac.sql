-- ============================================================
-- Auto-generated RBAC & Menu Migration for 拼团活动 (CombinationActivity)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-combination-activity',
  'mall-dir',
  '拼团活动管理',
  '/admin/mall/combination-activity',
  'mall/combination-activity/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:combination_activity:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-combination-activity-query',  'menu-combination-activity', '查询拼团活动', 'BUTTON', 'ACTIVE', 'mall:combination_activity:query',  1, NOW(), NOW()),
('menu-combination-activity-create', 'menu-combination-activity', '新增拼团活动', 'BUTTON', 'ACTIVE', 'mall:combination_activity:create', 2, NOW(), NOW()),
('menu-combination-activity-update', 'menu-combination-activity', '修改拼团活动', 'BUTTON', 'ACTIVE', 'mall:combination_activity:update', 3, NOW(), NOW()),
('menu-combination-activity-delete', 'menu-combination-activity', '删除拼团活动', 'BUTTON', 'ACTIVE', 'mall:combination_activity:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-combination-activity-rm',        '1', 'menu-combination-activity'),
('menu-combination-activity-rm-query',  '1', 'menu-combination-activity-query'),
('menu-combination-activity-rm-create', '1', 'menu-combination-activity-create'),
('menu-combination-activity-rm-update', '1', 'menu-combination-activity-update'),
('menu-combination-activity-rm-delete', '1', 'menu-combination-activity-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-combination-activity-pm',        '1', 'menu-combination-activity'),
('menu-combination-activity-pm-query',  '1', 'menu-combination-activity-query'),
('menu-combination-activity-pm-create', '1', 'menu-combination-activity-create'),
('menu-combination-activity-pm-update', '1', 'menu-combination-activity-update'),
('menu-combination-activity-pm-delete', '1', 'menu-combination-activity-delete')
ON CONFLICT DO NOTHING;
