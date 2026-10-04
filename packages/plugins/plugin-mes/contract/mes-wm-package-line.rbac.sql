-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 装箱明细 (MesWmPackageLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-package-line',
  'mes-dir',
  'MES 装箱明细管理',
  '/admin/mes/mes-wm-package-line',
  'mes/mes-wm-package-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_package_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-package-line-query',  'menu-mes-wm-package-line', '查询MES 装箱明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_package_line:query',  1, NOW(), NOW()),
('menu-mes-wm-package-line-create', 'menu-mes-wm-package-line', '新增MES 装箱明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_package_line:create', 2, NOW(), NOW()),
('menu-mes-wm-package-line-update', 'menu-mes-wm-package-line', '修改MES 装箱明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_package_line:update', 3, NOW(), NOW()),
('menu-mes-wm-package-line-delete', 'menu-mes-wm-package-line', '删除MES 装箱明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_package_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-package-line'),
('1', 'menu-mes-wm-package-line-query'),
('1', 'menu-mes-wm-package-line-create'),
('1', 'menu-mes-wm-package-line-update'),
('1', 'menu-mes-wm-package-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-package-line'),
('1', 'menu-mes-wm-package-line-query'),
('1', 'menu-mes-wm-package-line-create'),
('1', 'menu-mes-wm-package-line-update'),
('1', 'menu-mes-wm-package-line-delete')
ON CONFLICT DO NOTHING;
