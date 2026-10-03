-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmSn（源框架导入） (MesWmSn)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-sn',
  'mes-dir',
  'MesWmSn（源框架导入）管理',
  '/admin/mes/mes-wm-sn',
  'mes/mes-wm-sn/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_sn:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-sn-query',  'menu-mes-wm-sn', '查询MesWmSn（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_sn:query',  1, NOW(), NOW()),
('menu-mes-wm-sn-create', 'menu-mes-wm-sn', '新增MesWmSn（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_sn:create', 2, NOW(), NOW()),
('menu-mes-wm-sn-update', 'menu-mes-wm-sn', '修改MesWmSn（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_sn:update', 3, NOW(), NOW()),
('menu-mes-wm-sn-delete', 'menu-mes-wm-sn', '删除MesWmSn（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_sn:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-sn'),
('1', 'menu-mes-wm-sn-query'),
('1', 'menu-mes-wm-sn-create'),
('1', 'menu-mes-wm-sn-update'),
('1', 'menu-mes-wm-sn-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-sn'),
('1', 'menu-mes-wm-sn-query'),
('1', 'menu-mes-wm-sn-create'),
('1', 'menu-mes-wm-sn-update'),
('1', 'menu-mes-wm-sn-delete')
ON CONFLICT DO NOTHING;
