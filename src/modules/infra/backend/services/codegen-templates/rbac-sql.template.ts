import {
  type CodegenConfig,
  type CodegenOutput,
  toConstant,
  toKebab,
} from "./common"

export function generateRbacSql(config: CodegenConfig): CodegenOutput {
  const { className, moduleName, businessName } = config
  const kebab = toKebab(className)
  const constPrefix = config.permissionPrefix
    ? config.permissionPrefix.replace(/:/g, "_").toUpperCase()
    : `${moduleName.toUpperCase()}_${toConstant(className)}`

  const menuId = `menu-${kebab}`
  const parentId = config.parentMenuId || `${moduleName}-dir`
  const path = `/admin/${moduleName}/${kebab}`
  const component = `${moduleName}/${kebab}/index`
  const permPrefix = config.permissionPrefix || `${moduleName}:${kebab}`

  const content = `-- ============================================================
-- Auto-generated RBAC & Menu Migration for ${businessName} (${className})
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  '${menuId}',
  '${parentId}',
  '${businessName}管理',
  '${path}',
  '${component}',
  'table',
  10,
  'MENU',
  'ACTIVE',
  '${permPrefix}:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('${menuId}-query',  '${menuId}', '查询${businessName}', 'BUTTON', 'ACTIVE', '${permPrefix}:query',  1, NOW(), NOW()),
('${menuId}-create', '${menuId}', '新增${businessName}', 'BUTTON', 'ACTIVE', '${permPrefix}:create', 2, NOW(), NOW()),
('${menuId}-update', '${menuId}', '修改${businessName}', 'BUTTON', 'ACTIVE', '${permPrefix}:update', 3, NOW(), NOW()),
('${menuId}-delete', '${menuId}', '删除${businessName}', 'BUTTON', 'ACTIVE', '${permPrefix}:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', '${menuId}'),
('1', '${menuId}-query'),
('1', '${menuId}-create'),
('1', '${menuId}-update'),
('1', '${menuId}-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', '${menuId}'),
('1', '${menuId}-query'),
('1', '${menuId}-create'),
('1', '${menuId}-update'),
('1', '${menuId}-delete')
ON CONFLICT DO NOTHING;
`
  return {
    path: `src/modules/${moduleName}/contract/${kebab}.rbac.sql`,
    content,
    type: "sql",
  }
}
