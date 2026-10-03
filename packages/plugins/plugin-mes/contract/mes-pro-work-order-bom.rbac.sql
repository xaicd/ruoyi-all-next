-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesProWorkOrderBom（源框架导入） (MesProWorkOrderBom)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-pro-work-order-bom',
  'mes-dir',
  'MesProWorkOrderBom（源框架导入）管理',
  '/admin/mes/mes-pro-work-order-bom',
  'mes/mes-pro-work-order-bom/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_work_order_bom:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-pro-work-order-bom-query',  'menu-mes-pro-work-order-bom', '查询MesProWorkOrderBom（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_order_bom:query',  1, NOW(), NOW()),
('menu-mes-pro-work-order-bom-create', 'menu-mes-pro-work-order-bom', '新增MesProWorkOrderBom（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_order_bom:create', 2, NOW(), NOW()),
('menu-mes-pro-work-order-bom-update', 'menu-mes-pro-work-order-bom', '修改MesProWorkOrderBom（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_order_bom:update', 3, NOW(), NOW()),
('menu-mes-pro-work-order-bom-delete', 'menu-mes-pro-work-order-bom', '删除MesProWorkOrderBom（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_work_order_bom:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-pro-work-order-bom'),
('1', 'menu-mes-pro-work-order-bom-query'),
('1', 'menu-mes-pro-work-order-bom-create'),
('1', 'menu-mes-pro-work-order-bom-update'),
('1', 'menu-mes-pro-work-order-bom-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-pro-work-order-bom'),
('1', 'menu-mes-pro-work-order-bom-query'),
('1', 'menu-mes-pro-work-order-bom-create'),
('1', 'menu-mes-pro-work-order-bom-update'),
('1', 'menu-mes-pro-work-order-bom-delete')
ON CONFLICT DO NOTHING;
