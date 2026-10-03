-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmPackage（源框架导入） (MesWmPackage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-package',
  'mes-dir',
  'MesWmPackage（源框架导入）管理',
  '/admin/mes/mes-wm-package',
  'mes/mes-wm-package/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_package:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-package-query',  'menu-mes-wm-package', '查询MesWmPackage（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_package:query',  1, NOW(), NOW()),
('menu-mes-wm-package-create', 'menu-mes-wm-package', '新增MesWmPackage（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_package:create', 2, NOW(), NOW()),
('menu-mes-wm-package-update', 'menu-mes-wm-package', '修改MesWmPackage（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_package:update', 3, NOW(), NOW()),
('menu-mes-wm-package-delete', 'menu-mes-wm-package', '删除MesWmPackage（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_package:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-package'),
('1', 'menu-mes-wm-package-query'),
('1', 'menu-mes-wm-package-create'),
('1', 'menu-mes-wm-package-update'),
('1', 'menu-mes-wm-package-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-package'),
('1', 'menu-mes-wm-package-query'),
('1', 'menu-mes-wm-package-create'),
('1', 'menu-mes-wm-package-update'),
('1', 'menu-mes-wm-package-delete')
ON CONFLICT DO NOTHING;
