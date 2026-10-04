-- ============================================================
-- Auto-generated RBAC & Menu Migration for 限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动； (DiscountActivity)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-discount-activity',
  'mall-dir',
  '限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；管理',
  '/admin/mall/discount-activity',
  'mall/discount-activity/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:discount_activity:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-discount-activity-query',  'menu-discount-activity', '查询限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；', 'BUTTON', 'ACTIVE', 'mall:discount_activity:query',  1, NOW(), NOW()),
('menu-discount-activity-create', 'menu-discount-activity', '新增限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；', 'BUTTON', 'ACTIVE', 'mall:discount_activity:create', 2, NOW(), NOW()),
('menu-discount-activity-update', 'menu-discount-activity', '修改限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；', 'BUTTON', 'ACTIVE', 'mall:discount_activity:update', 3, NOW(), NOW()),
('menu-discount-activity-delete', 'menu-discount-activity', '删除限时折扣活动 DO一个活动下，可以有 商品；一个商品，在指定时间段内，只能属于一个活动；', 'BUTTON', 'ACTIVE', 'mall:discount_activity:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-discount-activity'),
('1', 'menu-discount-activity-query'),
('1', 'menu-discount-activity-create'),
('1', 'menu-discount-activity-update'),
('1', 'menu-discount-activity-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-discount-activity'),
('1', 'menu-discount-activity-query'),
('1', 'menu-discount-activity-create'),
('1', 'menu-discount-activity-update'),
('1', 'menu-discount-activity-delete')
ON CONFLICT DO NOTHING;
