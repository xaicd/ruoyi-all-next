-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 转移单行 (MesWmTransferLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-transfer-line',
  'mes-dir',
  'MES 转移单行管理',
  '/admin/mes/mes-wm-transfer-line',
  'mes/mes-wm-transfer-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_transfer_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-transfer-line-query',  'menu-mes-wm-transfer-line', '查询MES 转移单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_transfer_line:query',  1, NOW(), NOW()),
('menu-mes-wm-transfer-line-create', 'menu-mes-wm-transfer-line', '新增MES 转移单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_transfer_line:create', 2, NOW(), NOW()),
('menu-mes-wm-transfer-line-update', 'menu-mes-wm-transfer-line', '修改MES 转移单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_transfer_line:update', 3, NOW(), NOW()),
('menu-mes-wm-transfer-line-delete', 'menu-mes-wm-transfer-line', '删除MES 转移单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_transfer_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-transfer-line'),
('1', 'menu-mes-wm-transfer-line-query'),
('1', 'menu-mes-wm-transfer-line-create'),
('1', 'menu-mes-wm-transfer-line-update'),
('1', 'menu-mes-wm-transfer-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-transfer-line'),
('1', 'menu-mes-wm-transfer-line-query'),
('1', 'menu-mes-wm-transfer-line-create'),
('1', 'menu-mes-wm-transfer-line-update'),
('1', 'menu-mes-wm-transfer-line-delete')
ON CONFLICT DO NOTHING;
