-- ============================================================
-- Auto-generated RBAC & Menu Migration for 物料分类 (WmsItemCategory)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-item-category',
  'wms-dir',
  '物料分类管理',
  '/admin/wms/wms-item-category',
  'wms/wms-item-category/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:category:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-item-category-query',  'menu-wms-item-category', '查询物料分类', 'BUTTON', 'ACTIVE', 'wms:category:query',  1, NOW(), NOW()),
('menu-wms-item-category-create', 'menu-wms-item-category', '新增物料分类', 'BUTTON', 'ACTIVE', 'wms:category:create', 2, NOW(), NOW()),
('menu-wms-item-category-update', 'menu-wms-item-category', '修改物料分类', 'BUTTON', 'ACTIVE', 'wms:category:update', 3, NOW(), NOW()),
('menu-wms-item-category-delete', 'menu-wms-item-category', '删除物料分类', 'BUTTON', 'ACTIVE', 'wms:category:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-item-category'),
('1', 'menu-wms-item-category-query'),
('1', 'menu-wms-item-category-create'),
('1', 'menu-wms-item-category-update'),
('1', 'menu-wms-item-category-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-item-category'),
('1', 'menu-wms-item-category-query'),
('1', 'menu-wms-item-category-create'),
('1', 'menu-wms-item-category-update'),
('1', 'menu-wms-item-category-delete')
ON CONFLICT DO NOTHING;
