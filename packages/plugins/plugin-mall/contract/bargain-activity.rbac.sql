-- ============================================================
-- Auto-generated RBAC & Menu Migration for 砍价活动 (BargainActivity)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-bargain-activity',
  'mall-dir',
  '砍价活动管理',
  '/admin/mall/bargain-activity',
  'mall/bargain-activity/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:bargain_activity:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-bargain-activity-query',  'menu-bargain-activity', '查询砍价活动', 'BUTTON', 'ACTIVE', 'mall:bargain_activity:query',  1, NOW(), NOW()),
('menu-bargain-activity-create', 'menu-bargain-activity', '新增砍价活动', 'BUTTON', 'ACTIVE', 'mall:bargain_activity:create', 2, NOW(), NOW()),
('menu-bargain-activity-update', 'menu-bargain-activity', '修改砍价活动', 'BUTTON', 'ACTIVE', 'mall:bargain_activity:update', 3, NOW(), NOW()),
('menu-bargain-activity-delete', 'menu-bargain-activity', '删除砍价活动', 'BUTTON', 'ACTIVE', 'mall:bargain_activity:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-bargain-activity-rm',        '1', 'menu-bargain-activity'),
('menu-bargain-activity-rm-query',  '1', 'menu-bargain-activity-query'),
('menu-bargain-activity-rm-create', '1', 'menu-bargain-activity-create'),
('menu-bargain-activity-rm-update', '1', 'menu-bargain-activity-update'),
('menu-bargain-activity-rm-delete', '1', 'menu-bargain-activity-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-bargain-activity-pm',        '1', 'menu-bargain-activity'),
('menu-bargain-activity-pm-query',  '1', 'menu-bargain-activity-query'),
('menu-bargain-activity-pm-create', '1', 'menu-bargain-activity-create'),
('menu-bargain-activity-pm-update', '1', 'menu-bargain-activity-update'),
('menu-bargain-activity-pm-delete', '1', 'menu-bargain-activity-delete')
ON CONFLICT DO NOTHING;
