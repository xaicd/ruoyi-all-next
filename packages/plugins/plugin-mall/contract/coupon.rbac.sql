-- ============================================================
-- Auto-generated RBAC & Menu Migration for 优惠劵 (Coupon)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-coupon',
  'mall-dir',
  '优惠劵管理',
  '/admin/mall/coupon',
  'mall/coupon/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:coupon:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-coupon-query',  'menu-coupon', '查询优惠劵', 'BUTTON', 'ACTIVE', 'mall:coupon:query',  1, NOW(), NOW()),
('menu-coupon-create', 'menu-coupon', '新增优惠劵', 'BUTTON', 'ACTIVE', 'mall:coupon:create', 2, NOW(), NOW()),
('menu-coupon-update', 'menu-coupon', '修改优惠劵', 'BUTTON', 'ACTIVE', 'mall:coupon:update', 3, NOW(), NOW()),
('menu-coupon-delete', 'menu-coupon', '删除优惠劵', 'BUTTON', 'ACTIVE', 'mall:coupon:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-coupon-rm',        '1', 'menu-coupon'),
('menu-coupon-rm-query',  '1', 'menu-coupon-query'),
('menu-coupon-rm-create', '1', 'menu-coupon-create'),
('menu-coupon-rm-update', '1', 'menu-coupon-update'),
('menu-coupon-rm-delete', '1', 'menu-coupon-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-coupon-pm',        '1', 'menu-coupon'),
('menu-coupon-pm-query',  '1', 'menu-coupon-query'),
('menu-coupon-pm-create', '1', 'menu-coupon-create'),
('menu-coupon-pm-update', '1', 'menu-coupon-update'),
('menu-coupon-pm-delete', '1', 'menu-coupon-delete')
ON CONFLICT DO NOTHING;
