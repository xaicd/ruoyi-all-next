-- ============================================================
-- Auto-generated RBAC & Menu Migration for 自提门店 (DeliveryPickUpStore)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-delivery-pick-up-store',
  'mall-dir',
  '自提门店管理',
  '/admin/mall/delivery-pick-up-store',
  'mall/delivery-pick-up-store/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:delivery_pick_up_store:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-delivery-pick-up-store-query',  'menu-delivery-pick-up-store', '查询自提门店', 'BUTTON', 'ACTIVE', 'mall:delivery_pick_up_store:query',  1, NOW(), NOW()),
('menu-delivery-pick-up-store-create', 'menu-delivery-pick-up-store', '新增自提门店', 'BUTTON', 'ACTIVE', 'mall:delivery_pick_up_store:create', 2, NOW(), NOW()),
('menu-delivery-pick-up-store-update', 'menu-delivery-pick-up-store', '修改自提门店', 'BUTTON', 'ACTIVE', 'mall:delivery_pick_up_store:update', 3, NOW(), NOW()),
('menu-delivery-pick-up-store-delete', 'menu-delivery-pick-up-store', '删除自提门店', 'BUTTON', 'ACTIVE', 'mall:delivery_pick_up_store:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-delivery-pick-up-store'),
('1', 'menu-delivery-pick-up-store-query'),
('1', 'menu-delivery-pick-up-store-create'),
('1', 'menu-delivery-pick-up-store-update'),
('1', 'menu-delivery-pick-up-store-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-delivery-pick-up-store'),
('1', 'menu-delivery-pick-up-store-query'),
('1', 'menu-delivery-pick-up-store-create'),
('1', 'menu-delivery-pick-up-store-update'),
('1', 'menu-delivery-pick-up-store-delete')
ON CONFLICT DO NOTHING;
