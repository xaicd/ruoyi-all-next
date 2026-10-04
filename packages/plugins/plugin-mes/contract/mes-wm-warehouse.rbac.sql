-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 仓库 (MesWmWarehouse)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-warehouse',
  'mes-dir',
  'MES 仓库管理',
  '/admin/mes/mes-wm-warehouse',
  'mes/mes-wm-warehouse/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_warehouse:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-warehouse-query',  'menu-mes-wm-warehouse', '查询MES 仓库', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse:query',  1, NOW(), NOW()),
('menu-mes-wm-warehouse-create', 'menu-mes-wm-warehouse', '新增MES 仓库', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse:create', 2, NOW(), NOW()),
('menu-mes-wm-warehouse-update', 'menu-mes-wm-warehouse', '修改MES 仓库', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse:update', 3, NOW(), NOW()),
('menu-mes-wm-warehouse-delete', 'menu-mes-wm-warehouse', '删除MES 仓库', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-warehouse-rm',        '1', 'menu-mes-wm-warehouse'),
('menu-mes-wm-warehouse-rm-query',  '1', 'menu-mes-wm-warehouse-query'),
('menu-mes-wm-warehouse-rm-create', '1', 'menu-mes-wm-warehouse-create'),
('menu-mes-wm-warehouse-rm-update', '1', 'menu-mes-wm-warehouse-update'),
('menu-mes-wm-warehouse-rm-delete', '1', 'menu-mes-wm-warehouse-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-warehouse-pm',        '1', 'menu-mes-wm-warehouse'),
('menu-mes-wm-warehouse-pm-query',  '1', 'menu-mes-wm-warehouse-query'),
('menu-mes-wm-warehouse-pm-create', '1', 'menu-mes-wm-warehouse-create'),
('menu-mes-wm-warehouse-pm-update', '1', 'menu-mes-wm-warehouse-update'),
('menu-mes-wm-warehouse-pm-delete', '1', 'menu-mes-wm-warehouse-delete')
ON CONFLICT DO NOTHING;
