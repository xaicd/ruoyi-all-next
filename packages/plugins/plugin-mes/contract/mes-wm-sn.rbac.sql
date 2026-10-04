-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES SN 码 (MesWmSn)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-sn',
  'mes-dir',
  'MES SN 码管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-sn-query',  'menu-mes-wm-sn', '查询MES SN 码', 'BUTTON', 'ACTIVE', 'mes:mes_wm_sn:query',  1, NOW(), NOW()),
('menu-mes-wm-sn-create', 'menu-mes-wm-sn', '新增MES SN 码', 'BUTTON', 'ACTIVE', 'mes:mes_wm_sn:create', 2, NOW(), NOW()),
('menu-mes-wm-sn-update', 'menu-mes-wm-sn', '修改MES SN 码', 'BUTTON', 'ACTIVE', 'mes:mes_wm_sn:update', 3, NOW(), NOW()),
('menu-mes-wm-sn-delete', 'menu-mes-wm-sn', '删除MES SN 码', 'BUTTON', 'ACTIVE', 'mes:mes_wm_sn:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-sn-rm',        '1', 'menu-mes-wm-sn'),
('menu-mes-wm-sn-rm-query',  '1', 'menu-mes-wm-sn-query'),
('menu-mes-wm-sn-rm-create', '1', 'menu-mes-wm-sn-create'),
('menu-mes-wm-sn-rm-update', '1', 'menu-mes-wm-sn-update'),
('menu-mes-wm-sn-rm-delete', '1', 'menu-mes-wm-sn-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-sn-pm',        '1', 'menu-mes-wm-sn'),
('menu-mes-wm-sn-pm-query',  '1', 'menu-mes-wm-sn-query'),
('menu-mes-wm-sn-pm-create', '1', 'menu-mes-wm-sn-create'),
('menu-mes-wm-sn-pm-update', '1', 'menu-mes-wm-sn-update'),
('menu-mes-wm-sn-pm-delete', '1', 'menu-mes-wm-sn-delete')
ON CONFLICT DO NOTHING;
