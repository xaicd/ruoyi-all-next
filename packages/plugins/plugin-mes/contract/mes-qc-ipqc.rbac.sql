-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 过程检验单（IPQC, In-Process Quality Contr (MesQcIpqc)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-qc-ipqc',
  'mes-dir',
  'MES 过程检验单（IPQC, In-Process Quality Contr管理',
  '/admin/mes/mes-qc-ipqc',
  'mes/mes-qc-ipqc/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_ipqc:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-qc-ipqc-query',  'menu-mes-qc-ipqc', '查询MES 过程检验单（IPQC, In-Process Quality Contr', 'BUTTON', 'ACTIVE', 'mes:mes_qc_ipqc:query',  1, NOW(), NOW()),
('menu-mes-qc-ipqc-create', 'menu-mes-qc-ipqc', '新增MES 过程检验单（IPQC, In-Process Quality Contr', 'BUTTON', 'ACTIVE', 'mes:mes_qc_ipqc:create', 2, NOW(), NOW()),
('menu-mes-qc-ipqc-update', 'menu-mes-qc-ipqc', '修改MES 过程检验单（IPQC, In-Process Quality Contr', 'BUTTON', 'ACTIVE', 'mes:mes_qc_ipqc:update', 3, NOW(), NOW()),
('menu-mes-qc-ipqc-delete', 'menu-mes-qc-ipqc', '删除MES 过程检验单（IPQC, In-Process Quality Contr', 'BUTTON', 'ACTIVE', 'mes:mes_qc_ipqc:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-qc-ipqc-rm',        '1', 'menu-mes-qc-ipqc'),
('menu-mes-qc-ipqc-rm-query',  '1', 'menu-mes-qc-ipqc-query'),
('menu-mes-qc-ipqc-rm-create', '1', 'menu-mes-qc-ipqc-create'),
('menu-mes-qc-ipqc-rm-update', '1', 'menu-mes-qc-ipqc-update'),
('menu-mes-qc-ipqc-rm-delete', '1', 'menu-mes-qc-ipqc-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-qc-ipqc-pm',        '1', 'menu-mes-qc-ipqc'),
('menu-mes-qc-ipqc-pm-query',  '1', 'menu-mes-qc-ipqc-query'),
('menu-mes-qc-ipqc-pm-create', '1', 'menu-mes-qc-ipqc-create'),
('menu-mes-qc-ipqc-pm-update', '1', 'menu-mes-qc-ipqc-update'),
('menu-mes-qc-ipqc-pm-delete', '1', 'menu-mes-qc-ipqc-delete')
ON CONFLICT DO NOTHING;
