-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 出货检验单（OQC, Outgoing Quality Control） (MesQcOqc)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-qc-oqc',
  'mes-dir',
  'MES 出货检验单（OQC, Outgoing Quality Control）管理',
  '/admin/mes/mes-qc-oqc',
  'mes/mes-qc-oqc/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_oqc:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-qc-oqc-query',  'menu-mes-qc-oqc', '查询MES 出货检验单（OQC, Outgoing Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_oqc:query',  1, NOW(), NOW()),
('menu-mes-qc-oqc-create', 'menu-mes-qc-oqc', '新增MES 出货检验单（OQC, Outgoing Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_oqc:create', 2, NOW(), NOW()),
('menu-mes-qc-oqc-update', 'menu-mes-qc-oqc', '修改MES 出货检验单（OQC, Outgoing Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_oqc:update', 3, NOW(), NOW()),
('menu-mes-qc-oqc-delete', 'menu-mes-qc-oqc', '删除MES 出货检验单（OQC, Outgoing Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_oqc:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-qc-oqc-rm',        '1', 'menu-mes-qc-oqc'),
('menu-mes-qc-oqc-rm-query',  '1', 'menu-mes-qc-oqc-query'),
('menu-mes-qc-oqc-rm-create', '1', 'menu-mes-qc-oqc-create'),
('menu-mes-qc-oqc-rm-update', '1', 'menu-mes-qc-oqc-update'),
('menu-mes-qc-oqc-rm-delete', '1', 'menu-mes-qc-oqc-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-qc-oqc-pm',        '1', 'menu-mes-qc-oqc'),
('menu-mes-qc-oqc-pm-query',  '1', 'menu-mes-qc-oqc-query'),
('menu-mes-qc-oqc-pm-create', '1', 'menu-mes-qc-oqc-create'),
('menu-mes-qc-oqc-pm-update', '1', 'menu-mes-qc-oqc-update'),
('menu-mes-qc-oqc-pm-delete', '1', 'menu-mes-qc-oqc-delete')
ON CONFLICT DO NOTHING;
