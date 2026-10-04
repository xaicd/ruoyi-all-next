-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 来料检验单（IQC, Incoming Quality Control） (MesQcIqc)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-qc-iqc',
  'mes-dir',
  'MES 来料检验单（IQC, Incoming Quality Control）管理',
  '/admin/mes/mes-qc-iqc',
  'mes/mes-qc-iqc/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_iqc:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-qc-iqc-query',  'menu-mes-qc-iqc', '查询MES 来料检验单（IQC, Incoming Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_iqc:query',  1, NOW(), NOW()),
('menu-mes-qc-iqc-create', 'menu-mes-qc-iqc', '新增MES 来料检验单（IQC, Incoming Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_iqc:create', 2, NOW(), NOW()),
('menu-mes-qc-iqc-update', 'menu-mes-qc-iqc', '修改MES 来料检验单（IQC, Incoming Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_iqc:update', 3, NOW(), NOW()),
('menu-mes-qc-iqc-delete', 'menu-mes-qc-iqc', '删除MES 来料检验单（IQC, Incoming Quality Control）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_iqc:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-qc-iqc'),
('1', 'menu-mes-qc-iqc-query'),
('1', 'menu-mes-qc-iqc-create'),
('1', 'menu-mes-qc-iqc-update'),
('1', 'menu-mes-qc-iqc-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-qc-iqc'),
('1', 'menu-mes-qc-iqc-query'),
('1', 'menu-mes-qc-iqc-create'),
('1', 'menu-mes-qc-iqc-update'),
('1', 'menu-mes-qc-iqc-delete')
ON CONFLICT DO NOTHING;
