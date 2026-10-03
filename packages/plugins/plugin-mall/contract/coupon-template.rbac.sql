-- ============================================================
-- Auto-generated RBAC & Menu Migration for CouponTemplate（源框架导入） (CouponTemplate)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-coupon-template',
  'mall-dir',
  'CouponTemplate（源框架导入）管理',
  '/admin/mall/coupon-template',
  'mall/coupon-template/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:coupon_template:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-coupon-template-query',  'menu-coupon-template', '查询CouponTemplate（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:coupon_template:query',  1, NOW(), NOW()),
('menu-coupon-template-create', 'menu-coupon-template', '新增CouponTemplate（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:coupon_template:create', 2, NOW(), NOW()),
('menu-coupon-template-update', 'menu-coupon-template', '修改CouponTemplate（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:coupon_template:update', 3, NOW(), NOW()),
('menu-coupon-template-delete', 'menu-coupon-template', '删除CouponTemplate（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:coupon_template:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-coupon-template'),
('1', 'menu-coupon-template-query'),
('1', 'menu-coupon-template-create'),
('1', 'menu-coupon-template-update'),
('1', 'menu-coupon-template-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-coupon-template'),
('1', 'menu-coupon-template-query'),
('1', 'menu-coupon-template-create'),
('1', 'menu-coupon-template-update'),
('1', 'menu-coupon-template-delete')
ON CONFLICT DO NOTHING;
