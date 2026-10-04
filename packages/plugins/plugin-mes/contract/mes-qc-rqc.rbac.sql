-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 退货检验单（RQC, Return Quality Control） (MesQcRqc)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-qc-rqc',
  'mes-dir',
  'MES 退货检验单（RQC, Return Quality Control）管理',
  '/admin/mes/mes-qc-rqc',
  'mes/mes-qc-rqc/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_rqc:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-qc-rqc-query',  'menu-mes-qc-rqc', '查询MES 退货检验单（RQC, Return Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_rqc:query',  1, NOW(), NOW()),
('menu-mes-qc-rqc-create', 'menu-mes-qc-rqc', '新增MES 退货检验单（RQC, Return Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_rqc:create', 2, NOW(), NOW()),
('menu-mes-qc-rqc-update', 'menu-mes-qc-rqc', '修改MES 退货检验单（RQC, Return Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_rqc:update', 3, NOW(), NOW()),
('menu-mes-qc-rqc-delete', 'menu-mes-qc-rqc', '删除MES 退货检验单（RQC, Return Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_rqc:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-qc-rqc-rm',        '1', 'menu-mes-qc-rqc'),
('menu-mes-qc-rqc-rm-query',  '1', 'menu-mes-qc-rqc-query'),
('menu-mes-qc-rqc-rm-create', '1', 'menu-mes-qc-rqc-create'),
('menu-mes-qc-rqc-rm-update', '1', 'menu-mes-qc-rqc-update'),
('menu-mes-qc-rqc-rm-delete', '1', 'menu-mes-qc-rqc-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-qc-rqc-pm',        '1', 'menu-mes-qc-rqc'),
('menu-mes-qc-rqc-pm-query',  '1', 'menu-mes-qc-rqc-query'),
('menu-mes-qc-rqc-pm-create', '1', 'menu-mes-qc-rqc-create'),
('menu-mes-qc-rqc-pm-update', '1', 'menu-mes-qc-rqc-update'),
('menu-mes-qc-rqc-pm-delete', '1', 'menu-mes-qc-rqc-delete')
ON CONFLICT DO NOTHING;
