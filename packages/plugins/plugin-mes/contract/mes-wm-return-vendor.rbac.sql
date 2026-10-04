-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 供应商退货单 (MesWmReturnVendor)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-return-vendor',
  'mes-dir',
  'MES 供应商退货单管理',
  '/admin/mes/mes-wm-return-vendor',
  'mes/mes-wm-return-vendor/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_return_vendor:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-return-vendor-query',  'menu-mes-wm-return-vendor', '查询MES 供应商退货单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor:query',  1, NOW(), NOW()),
('menu-mes-wm-return-vendor-create', 'menu-mes-wm-return-vendor', '新增MES 供应商退货单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor:create', 2, NOW(), NOW()),
('menu-mes-wm-return-vendor-update', 'menu-mes-wm-return-vendor', '修改MES 供应商退货单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor:update', 3, NOW(), NOW()),
('menu-mes-wm-return-vendor-delete', 'menu-mes-wm-return-vendor', '删除MES 供应商退货单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_vendor:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-return-vendor-rm',        '1', 'menu-mes-wm-return-vendor'),
('menu-mes-wm-return-vendor-rm-query',  '1', 'menu-mes-wm-return-vendor-query'),
('menu-mes-wm-return-vendor-rm-create', '1', 'menu-mes-wm-return-vendor-create'),
('menu-mes-wm-return-vendor-rm-update', '1', 'menu-mes-wm-return-vendor-update'),
('menu-mes-wm-return-vendor-rm-delete', '1', 'menu-mes-wm-return-vendor-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-return-vendor-pm',        '1', 'menu-mes-wm-return-vendor'),
('menu-mes-wm-return-vendor-pm-query',  '1', 'menu-mes-wm-return-vendor-query'),
('menu-mes-wm-return-vendor-pm-create', '1', 'menu-mes-wm-return-vendor-create'),
('menu-mes-wm-return-vendor-pm-update', '1', 'menu-mes-wm-return-vendor-update'),
('menu-mes-wm-return-vendor-pm-delete', '1', 'menu-mes-wm-return-vendor-delete')
ON CONFLICT DO NOTHING;
