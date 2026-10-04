-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 仓库 (ErpWarehouse)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-warehouse',
  'erp-dir',
  'ERP 仓库管理',
  '/admin/erp/erp-warehouse',
  'erp/erp-warehouse/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_warehouse:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-warehouse-query',  'menu-erp-warehouse', '查询ERP 仓库', 'BUTTON', 'ACTIVE', 'erp:erp_warehouse:query',  1, NOW(), NOW()),
('menu-erp-warehouse-create', 'menu-erp-warehouse', '新增ERP 仓库', 'BUTTON', 'ACTIVE', 'erp:erp_warehouse:create', 2, NOW(), NOW()),
('menu-erp-warehouse-update', 'menu-erp-warehouse', '修改ERP 仓库', 'BUTTON', 'ACTIVE', 'erp:erp_warehouse:update', 3, NOW(), NOW()),
('menu-erp-warehouse-delete', 'menu-erp-warehouse', '删除ERP 仓库', 'BUTTON', 'ACTIVE', 'erp:erp_warehouse:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-warehouse-rm',        '1', 'menu-erp-warehouse'),
('menu-erp-warehouse-rm-query',  '1', 'menu-erp-warehouse-query'),
('menu-erp-warehouse-rm-create', '1', 'menu-erp-warehouse-create'),
('menu-erp-warehouse-rm-update', '1', 'menu-erp-warehouse-update'),
('menu-erp-warehouse-rm-delete', '1', 'menu-erp-warehouse-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-warehouse-pm',        '1', 'menu-erp-warehouse'),
('menu-erp-warehouse-pm-query',  '1', 'menu-erp-warehouse-query'),
('menu-erp-warehouse-pm-create', '1', 'menu-erp-warehouse-create'),
('menu-erp-warehouse-pm-update', '1', 'menu-erp-warehouse-update'),
('menu-erp-warehouse-pm-delete', '1', 'menu-erp-warehouse-delete')
ON CONFLICT DO NOTHING;
