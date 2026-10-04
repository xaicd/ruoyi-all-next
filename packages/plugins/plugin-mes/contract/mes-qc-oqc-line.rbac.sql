-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 出货检验单行 (MesQcOqcLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-qc-oqc-line',
  'mes-dir',
  'MES 出货检验单行管理',
  '/admin/mes/mes-qc-oqc-line',
  'mes/mes-qc-oqc-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_oqc_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-qc-oqc-line-query',  'menu-mes-qc-oqc-line', '查询MES 出货检验单行', 'BUTTON', 'ACTIVE', 'mes:mes_qc_oqc_line:query',  1, NOW(), NOW()),
('menu-mes-qc-oqc-line-create', 'menu-mes-qc-oqc-line', '新增MES 出货检验单行', 'BUTTON', 'ACTIVE', 'mes:mes_qc_oqc_line:create', 2, NOW(), NOW()),
('menu-mes-qc-oqc-line-update', 'menu-mes-qc-oqc-line', '修改MES 出货检验单行', 'BUTTON', 'ACTIVE', 'mes:mes_qc_oqc_line:update', 3, NOW(), NOW()),
('menu-mes-qc-oqc-line-delete', 'menu-mes-qc-oqc-line', '删除MES 出货检验单行', 'BUTTON', 'ACTIVE', 'mes:mes_qc_oqc_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-qc-oqc-line'),
('1', 'menu-mes-qc-oqc-line-query'),
('1', 'menu-mes-qc-oqc-line-create'),
('1', 'menu-mes-qc-oqc-line-update'),
('1', 'menu-mes-qc-oqc-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-qc-oqc-line'),
('1', 'menu-mes-qc-oqc-line-query'),
('1', 'menu-mes-qc-oqc-line-create'),
('1', 'menu-mes-qc-oqc-line-update'),
('1', 'menu-mes-qc-oqc-line-delete')
ON CONFLICT DO NOTHING;
