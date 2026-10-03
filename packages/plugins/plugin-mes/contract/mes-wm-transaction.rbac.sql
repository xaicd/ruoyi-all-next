-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmTransaction（源框架导入） (MesWmTransaction)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-transaction',
  'mes-dir',
  'MesWmTransaction（源框架导入）管理',
  '/admin/mes/mes-wm-transaction',
  'mes/mes-wm-transaction/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_transaction:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-transaction-query',  'menu-mes-wm-transaction', '查询MesWmTransaction（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_transaction:query',  1, NOW(), NOW()),
('menu-mes-wm-transaction-create', 'menu-mes-wm-transaction', '新增MesWmTransaction（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_transaction:create', 2, NOW(), NOW()),
('menu-mes-wm-transaction-update', 'menu-mes-wm-transaction', '修改MesWmTransaction（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_transaction:update', 3, NOW(), NOW()),
('menu-mes-wm-transaction-delete', 'menu-mes-wm-transaction', '删除MesWmTransaction（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_transaction:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-transaction'),
('1', 'menu-mes-wm-transaction-query'),
('1', 'menu-mes-wm-transaction-create'),
('1', 'menu-mes-wm-transaction-update'),
('1', 'menu-mes-wm-transaction-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-transaction'),
('1', 'menu-mes-wm-transaction-query'),
('1', 'menu-mes-wm-transaction-create'),
('1', 'menu-mes-wm-transaction-update'),
('1', 'menu-mes-wm-transaction-delete')
ON CONFLICT DO NOTHING;
