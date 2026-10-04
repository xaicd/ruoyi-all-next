-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商品 SPU (ProductSpu)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-product-spu',
  'mall-dir',
  '商品 SPU管理',
  '/admin/mall/product-spu',
  'mall/product-spu/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_spu:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-product-spu-query',  'menu-product-spu', '查询商品 SPU', 'BUTTON', 'ACTIVE', 'mall:product_spu:query',  1, NOW(), NOW()),
('menu-product-spu-create', 'menu-product-spu', '新增商品 SPU', 'BUTTON', 'ACTIVE', 'mall:product_spu:create', 2, NOW(), NOW()),
('menu-product-spu-update', 'menu-product-spu', '修改商品 SPU', 'BUTTON', 'ACTIVE', 'mall:product_spu:update', 3, NOW(), NOW()),
('menu-product-spu-delete', 'menu-product-spu', '删除商品 SPU', 'BUTTON', 'ACTIVE', 'mall:product_spu:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-product-spu-rm',        '1', 'menu-product-spu'),
('menu-product-spu-rm-query',  '1', 'menu-product-spu-query'),
('menu-product-spu-rm-create', '1', 'menu-product-spu-create'),
('menu-product-spu-rm-update', '1', 'menu-product-spu-update'),
('menu-product-spu-rm-delete', '1', 'menu-product-spu-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-product-spu-pm',        '1', 'menu-product-spu'),
('menu-product-spu-pm-query',  '1', 'menu-product-spu-query'),
('menu-product-spu-pm-create', '1', 'menu-product-spu-create'),
('menu-product-spu-pm-update', '1', 'menu-product-spu-update'),
('menu-product-spu-pm-delete', '1', 'menu-product-spu-delete')
ON CONFLICT DO NOTHING;
