-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 物料产品分类 (MesMdItemType)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-item-type',
  'mes-dir',
  'MES 物料产品分类管理',
  '/admin/mes/mes-md-item-type',
  'mes/mes-md-item-type/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_item_type:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-item-type-query',  'menu-mes-md-item-type', '查询MES 物料产品分类', 'BUTTON', 'ACTIVE', 'mes:mes_md_item_type:query',  1, NOW(), NOW()),
('menu-mes-md-item-type-create', 'menu-mes-md-item-type', '新增MES 物料产品分类', 'BUTTON', 'ACTIVE', 'mes:mes_md_item_type:create', 2, NOW(), NOW()),
('menu-mes-md-item-type-update', 'menu-mes-md-item-type', '修改MES 物料产品分类', 'BUTTON', 'ACTIVE', 'mes:mes_md_item_type:update', 3, NOW(), NOW()),
('menu-mes-md-item-type-delete', 'menu-mes-md-item-type', '删除MES 物料产品分类', 'BUTTON', 'ACTIVE', 'mes:mes_md_item_type:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-item-type'),
('1', 'menu-mes-md-item-type-query'),
('1', 'menu-mes-md-item-type-create'),
('1', 'menu-mes-md-item-type-update'),
('1', 'menu-mes-md-item-type-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-item-type'),
('1', 'menu-mes-md-item-type-query'),
('1', 'menu-mes-md-item-type-create'),
('1', 'menu-mes-md-item-type-update'),
('1', 'menu-mes-md-item-type-delete')
ON CONFLICT DO NOTHING;
