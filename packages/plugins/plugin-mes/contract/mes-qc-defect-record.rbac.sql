-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 质检缺陷记录 DO通用缺陷记录表，通过 区分检验类型（IQC、IPQC、 (MesQcDefectRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-qc-defect-record',
  'mes-dir',
  'MES 质检缺陷记录 DO通用缺陷记录表，通过 区分检验类型（IQC、IPQC、管理',
  '/admin/mes/mes-qc-defect-record',
  'mes/mes-qc-defect-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_defect_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-qc-defect-record-query',  'menu-mes-qc-defect-record', '查询MES 质检缺陷记录 DO通用缺陷记录表，通过 区分检验类型（IQC、IPQC、', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect_record:query',  1, NOW(), NOW()),
('menu-mes-qc-defect-record-create', 'menu-mes-qc-defect-record', '新增MES 质检缺陷记录 DO通用缺陷记录表，通过 区分检验类型（IQC、IPQC、', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect_record:create', 2, NOW(), NOW()),
('menu-mes-qc-defect-record-update', 'menu-mes-qc-defect-record', '修改MES 质检缺陷记录 DO通用缺陷记录表，通过 区分检验类型（IQC、IPQC、', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect_record:update', 3, NOW(), NOW()),
('menu-mes-qc-defect-record-delete', 'menu-mes-qc-defect-record', '删除MES 质检缺陷记录 DO通用缺陷记录表，通过 区分检验类型（IQC、IPQC、', 'BUTTON', 'ACTIVE', 'mes:mes_qc_defect_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-qc-defect-record-rm',        '1', 'menu-mes-qc-defect-record'),
('menu-mes-qc-defect-record-rm-query',  '1', 'menu-mes-qc-defect-record-query'),
('menu-mes-qc-defect-record-rm-create', '1', 'menu-mes-qc-defect-record-create'),
('menu-mes-qc-defect-record-rm-update', '1', 'menu-mes-qc-defect-record-update'),
('menu-mes-qc-defect-record-rm-delete', '1', 'menu-mes-qc-defect-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-qc-defect-record-pm',        '1', 'menu-mes-qc-defect-record'),
('menu-mes-qc-defect-record-pm-query',  '1', 'menu-mes-qc-defect-record-query'),
('menu-mes-qc-defect-record-pm-create', '1', 'menu-mes-qc-defect-record-create'),
('menu-mes-qc-defect-record-pm-update', '1', 'menu-mes-qc-defect-record-update'),
('menu-mes-qc-defect-record-pm-delete', '1', 'menu-mes-qc-defect-record-delete')
ON CONFLICT DO NOTHING;
