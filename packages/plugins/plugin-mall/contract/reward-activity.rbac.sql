-- ============================================================
-- Auto-generated RBAC & Menu Migration for 满减送活动 (RewardActivity)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-reward-activity',
  'mall-dir',
  '满减送活动管理',
  '/admin/mall/reward-activity',
  'mall/reward-activity/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:reward_activity:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-reward-activity-query',  'menu-reward-activity', '查询满减送活动', 'BUTTON', 'ACTIVE', 'mall:reward_activity:query',  1, NOW(), NOW()),
('menu-reward-activity-create', 'menu-reward-activity', '新增满减送活动', 'BUTTON', 'ACTIVE', 'mall:reward_activity:create', 2, NOW(), NOW()),
('menu-reward-activity-update', 'menu-reward-activity', '修改满减送活动', 'BUTTON', 'ACTIVE', 'mall:reward_activity:update', 3, NOW(), NOW()),
('menu-reward-activity-delete', 'menu-reward-activity', '删除满减送活动', 'BUTTON', 'ACTIVE', 'mall:reward_activity:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-reward-activity'),
('1', 'menu-reward-activity-query'),
('1', 'menu-reward-activity-create'),
('1', 'menu-reward-activity-update'),
('1', 'menu-reward-activity-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-reward-activity'),
('1', 'menu-reward-activity-query'),
('1', 'menu-reward-activity-create'),
('1', 'menu-reward-activity-update'),
('1', 'menu-reward-activity-delete')
ON CONFLICT DO NOTHING;
