-- ============================================================
-- Auto-generated RBAC & Menu Migration for SeckillActivity（源框架导入） (SeckillActivity)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-seckill-activity',
  'mall-dir',
  'SeckillActivity（源框架导入）管理',
  '/admin/mall/seckill-activity',
  'mall/seckill-activity/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:seckill_activity:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-seckill-activity-query',  'menu-seckill-activity', '查询SeckillActivity（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:seckill_activity:query',  1, NOW(), NOW()),
('menu-seckill-activity-create', 'menu-seckill-activity', '新增SeckillActivity（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:seckill_activity:create', 2, NOW(), NOW()),
('menu-seckill-activity-update', 'menu-seckill-activity', '修改SeckillActivity（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:seckill_activity:update', 3, NOW(), NOW()),
('menu-seckill-activity-delete', 'menu-seckill-activity', '删除SeckillActivity（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:seckill_activity:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-seckill-activity'),
('1', 'menu-seckill-activity-query'),
('1', 'menu-seckill-activity-create'),
('1', 'menu-seckill-activity-update'),
('1', 'menu-seckill-activity-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-seckill-activity'),
('1', 'menu-seckill-activity-query'),
('1', 'menu-seckill-activity-create'),
('1', 'menu-seckill-activity-update'),
('1', 'menu-seckill-activity-delete')
ON CONFLICT DO NOTHING;
