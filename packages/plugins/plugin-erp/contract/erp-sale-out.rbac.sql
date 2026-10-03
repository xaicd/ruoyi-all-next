-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpSaleOut（源框架导入） (ErpSaleOut)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-sale-out',
  'erp-dir',
  'ErpSaleOut（源框架导入）管理',
  '/admin/erp/erp-sale-out',
  'erp/erp-sale-out/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_sale_out:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-sale-out-query',  'menu-erp-sale-out', '查询ErpSaleOut（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_sale_out:query',  1, NOW(), NOW()),
('menu-erp-sale-out-create', 'menu-erp-sale-out', '新增ErpSaleOut（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_sale_out:create', 2, NOW(), NOW()),
('menu-erp-sale-out-update', 'menu-erp-sale-out', '修改ErpSaleOut（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_sale_out:update', 3, NOW(), NOW()),
('menu-erp-sale-out-delete', 'menu-erp-sale-out', '删除ErpSaleOut（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_sale_out:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-sale-out'),
('1', 'menu-erp-sale-out-query'),
('1', 'menu-erp-sale-out-create'),
('1', 'menu-erp-sale-out-update'),
('1', 'menu-erp-sale-out-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-sale-out'),
('1', 'menu-erp-sale-out-query'),
('1', 'menu-erp-sale-out-create'),
('1', 'menu-erp-sale-out-update'),
('1', 'menu-erp-sale-out-delete')
ON CONFLICT DO NOTHING;
