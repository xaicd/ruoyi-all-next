-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesQcTemplateItem（源框架导入） (MesQcTemplateItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-qc-template-item',
  'mes-dir',
  'MesQcTemplateItem（源框架导入）管理',
  '/admin/mes/mes-qc-template-item',
  'mes/mes-qc-template-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_qc_template_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-qc-template-item-query',  'menu-mes-qc-template-item', '查询MesQcTemplateItem（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_template_item:query',  1, NOW(), NOW()),
('menu-mes-qc-template-item-create', 'menu-mes-qc-template-item', '新增MesQcTemplateItem（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_template_item:create', 2, NOW(), NOW()),
('menu-mes-qc-template-item-update', 'menu-mes-qc-template-item', '修改MesQcTemplateItem（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_template_item:update', 3, NOW(), NOW()),
('menu-mes-qc-template-item-delete', 'menu-mes-qc-template-item', '删除MesQcTemplateItem（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_qc_template_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-qc-template-item'),
('1', 'menu-mes-qc-template-item-query'),
('1', 'menu-mes-qc-template-item-create'),
('1', 'menu-mes-qc-template-item-update'),
('1', 'menu-mes-qc-template-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-qc-template-item'),
('1', 'menu-mes-qc-template-item-query'),
('1', 'menu-mes-qc-template-item-create'),
('1', 'menu-mes-qc-template-item-update'),
('1', 'menu-mes-qc-template-item-delete')
ON CONFLICT DO NOTHING;
