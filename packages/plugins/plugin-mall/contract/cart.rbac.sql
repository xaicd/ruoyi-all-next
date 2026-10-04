-- ============================================================
-- Auto-generated RBAC & Menu Migration for 购物车的商品信息 DO每个商品，对应一条记录，通过 和 关联 (Cart)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-cart',
  'mall-dir',
  '购物车的商品信息 DO每个商品，对应一条记录，通过 和 关联管理',
  '/admin/mall/cart',
  'mall/cart/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:cart:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-cart-query',  'menu-cart', '查询购物车的商品信息 DO每个商品，对应一条记录，通过 和 关联', 'BUTTON', 'ACTIVE', 'mall:cart:query',  1, NOW(), NOW()),
('menu-cart-create', 'menu-cart', '新增购物车的商品信息 DO每个商品，对应一条记录，通过 和 关联', 'BUTTON', 'ACTIVE', 'mall:cart:create', 2, NOW(), NOW()),
('menu-cart-update', 'menu-cart', '修改购物车的商品信息 DO每个商品，对应一条记录，通过 和 关联', 'BUTTON', 'ACTIVE', 'mall:cart:update', 3, NOW(), NOW()),
('menu-cart-delete', 'menu-cart', '删除购物车的商品信息 DO每个商品，对应一条记录，通过 和 关联', 'BUTTON', 'ACTIVE', 'mall:cart:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-cart-rm',        '1', 'menu-cart'),
('menu-cart-rm-query',  '1', 'menu-cart-query'),
('menu-cart-rm-create', '1', 'menu-cart-create'),
('menu-cart-rm-update', '1', 'menu-cart-update'),
('menu-cart-rm-delete', '1', 'menu-cart-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-cart-pm',        '1', 'menu-cart'),
('menu-cart-pm-query',  '1', 'menu-cart-query'),
('menu-cart-pm-create', '1', 'menu-cart-create'),
('menu-cart-pm-update', '1', 'menu-cart-update'),
('menu-cart-pm-delete', '1', 'menu-cart-delete')
ON CONFLICT DO NOTHING;
