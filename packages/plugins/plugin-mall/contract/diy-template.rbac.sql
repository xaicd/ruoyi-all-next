-- ============================================================
-- Auto-generated RBAC & Menu Migration for 装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个 (DiyTemplate)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-diy-template',
  'mall-dir',
  '装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个管理',
  '/admin/mall/diy-template',
  'mall/diy-template/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:diy_template:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-diy-template-query',  'menu-diy-template', '查询装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个', 'BUTTON', 'ACTIVE', 'mall:diy_template:query',  1, NOW(), NOW()),
('menu-diy-template-create', 'menu-diy-template', '新增装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个', 'BUTTON', 'ACTIVE', 'mall:diy_template:create', 2, NOW(), NOW()),
('menu-diy-template-update', 'menu-diy-template', '修改装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个', 'BUTTON', 'ACTIVE', 'mall:diy_template:update', 3, NOW(), NOW()),
('menu-diy-template-delete', 'menu-diy-template', '删除装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个', 'BUTTON', 'ACTIVE', 'mall:diy_template:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-diy-template'),
('1', 'menu-diy-template-query'),
('1', 'menu-diy-template-create'),
('1', 'menu-diy-template-update'),
('1', 'menu-diy-template-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-diy-template'),
('1', 'menu-diy-template-query'),
('1', 'menu-diy-template-create'),
('1', 'menu-diy-template-update'),
('1', 'menu-diy-template-delete')
ON CONFLICT DO NOTHING;
