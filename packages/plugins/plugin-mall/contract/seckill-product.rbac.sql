-- ============================================================
-- Auto-generated RBAC & Menu Migration for 秒杀参与商品 (SeckillProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-seckill-product',
  'mall-dir',
  '秒杀参与商品管理',
  '/admin/mall/seckill-product',
  'mall/seckill-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:seckill_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-seckill-product-query',  'menu-seckill-product', '查询秒杀参与商品', 'BUTTON', 'ACTIVE', 'mall:seckill_product:query',  1, NOW(), NOW()),
('menu-seckill-product-create', 'menu-seckill-product', '新增秒杀参与商品', 'BUTTON', 'ACTIVE', 'mall:seckill_product:create', 2, NOW(), NOW()),
('menu-seckill-product-update', 'menu-seckill-product', '修改秒杀参与商品', 'BUTTON', 'ACTIVE', 'mall:seckill_product:update', 3, NOW(), NOW()),
('menu-seckill-product-delete', 'menu-seckill-product', '删除秒杀参与商品', 'BUTTON', 'ACTIVE', 'mall:seckill_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-seckill-product'),
('1', 'menu-seckill-product-query'),
('1', 'menu-seckill-product-create'),
('1', 'menu-seckill-product-update'),
('1', 'menu-seckill-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-seckill-product'),
('1', 'menu-seckill-product-query'),
('1', 'menu-seckill-product-create'),
('1', 'menu-seckill-product-update'),
('1', 'menu-seckill-product-delete')
ON CONFLICT DO NOTHING;
