const fs = require('fs')
const path = require('path')

// 权威 4 字符映射字典
const RENAME_MAP = {
  // 1. 基础设施与低代码
  '业务建模（Online）': '在线建模',
  '业务建模': '在线建模',
  'Online 代码生成': '在线建模',
  'AUTO报表': '动态报表',
  'AUTO 报表': '动态报表',
  '数据源配置': '数据源库',
  '代码生成（存量表）': '代码生成',
  '代码案例': '代码案例',
  'API 接口': '接口文档',
  'API接口': '接口文档',
  '系统接口': '接口文档',
  'Redis 监控': '缓存监控',
  'Redis监控': '缓存监控',
  'API 日志': '访问日志',
  'API日志': '访问日志',
  'API 访问日志': '访问日志',
  'API 错误日志': '错误日志',
  'MySQL 监控': '库表监控',
  'MySQL监控': '库表监控',
  'Java 监控': '服务监控',
  'Java监控': '服务监控',

  // 2. 系统管理
  'OAuth2 客户端': '授权应用',
  'OAuth2客户端': '授权应用',
  'OAuth2 令牌': '授权令牌',
  'OAuth2令牌': '授权令牌',
  'IP 属地': '地区管理',
  'IP属地': '地区管理',
  'IP区域': '地区管理',
  '工作流编排': '流程编排',

  // 3. 业务中台与生态
  '公众号中心': '微信公号',
  '公众号账号': '账号管理',
  'ERP商品': '商品管理',
  'ERP订单': '订单管理',
  '退款单': '退款单据',
  'IoT中台': '物联中台',
  '客户端沙箱': '联调沙箱',
  '代理商工作台': '渠道门户',
  '渠道代理商': '代理商户',
  '商机报备锁定': '商机报备',
  '应用生态': '生态应用',
}

// 需处理的种子和配置文件清单
const TARGET_FILES = [
  path.resolve(__dirname, '../prisma/data/menus.seed-data.ts'),
  path.resolve(__dirname, '../scripts/seed-output/menus.seed.ts'),
  path.resolve(__dirname, '../src/modules/online/contract/menu-catalog.ts'),
  path.resolve(__dirname, '../src/modules/aigw/contract/menu-catalog.ts'),
  path.resolve(__dirname, '../src/modules/shared/backend/constants/admin-menu.ts'),
]

console.log('[MENU-AUDITOR] Starting comprehensive menu audit & format...')

let totalReplacements = 0
for (const file of TARGET_FILES) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8')
    let fileChanged = 0
    for (const [from, to] of Object.entries(RENAME_MAP)) {
      const matchPattern = `"${from}"`
      const replaceWith = `"${to}"`
      if (content.includes(matchPattern)) {
        content = content.split(matchPattern).join(replaceWith)
        fileChanged++
        totalReplacements++
      }
    }
    if (fileChanged > 0) {
      fs.writeFileSync(file, content, 'utf-8')
      console.log(`[MENU-AUDITOR] Updated ${fileChanged} names in: ${path.basename(file)}`)
    }
  }
}

// 生成并持久化修正 SQL 文件
const sqlPath = path.resolve(__dirname, '../sql/20260824_format_menus_4chars.sql')
const sqlContent = `-- ==============================================================================
-- 工整化 4 字符菜单名称迁移与持久化脚本 (2026-08-24)
-- 作用：将存量与扩展菜单名称统一调整为工整的 4 个汉字
-- ==============================================================================

-- 1. 基础设施与低代码域
UPDATE system_menu SET name = '在线建模' WHERE name IN ('业务建模（Online）', '业务建模', 'Online 代码生成', 'Online代码生成') OR path = 'online-definitions';
UPDATE system_menu SET name = '动态报表' WHERE name IN ('AUTO报表', 'AUTO 报表') OR path = 'online-test';
UPDATE system_menu SET name = '数据源库' WHERE name = '数据源配置' OR path = 'db-configs';
UPDATE system_menu SET name = '代码生成' WHERE name IN ('代码生成（存量表）', '代码生成') AND path = 'codegen';
UPDATE system_menu SET name = '接口文档' WHERE name IN ('系统接口', 'API 接口', 'API接口', 'Swagger接口') OR path = 'swagger';
UPDATE system_menu SET name = '缓存监控' WHERE name IN ('Redis 监控', 'Redis监控') OR path = 'redis';
UPDATE system_menu SET name = '库表监控' WHERE name IN ('MySQL 监控', 'MySQL监控');
UPDATE system_menu SET name = '服务监控' WHERE name IN ('Java 监控', 'Java监控');

-- 2. 系统管理域
UPDATE system_menu SET name = '授权应用' WHERE name IN ('OAuth2 客户端', 'OAuth2客户端') OR path = 'oauth2-clients';
UPDATE system_menu SET name = '授权令牌' WHERE name IN ('OAuth2 令牌', 'OAuth2令牌') OR path = 'oauth2-tokens';
UPDATE system_menu SET name = '地区管理' WHERE name IN ('IP 属地', 'IP属地', 'IP区域') OR path = 'ip-areas';
UPDATE system_menu SET name = '流程编排' WHERE name = '工作流编排';

-- 3. 业务与模型中台域
UPDATE system_menu SET name = '微信公号' WHERE name = '公众号中心';
UPDATE system_menu SET name = '账号管理' WHERE name = '公众号账号';
UPDATE system_menu SET name = '商品管理' WHERE name = 'ERP商品';
UPDATE system_menu SET name = '订单管理' WHERE name = 'ERP订单';
UPDATE system_menu SET name = '退款单据' WHERE name = '退款单';
UPDATE system_menu SET name = '物联中台' WHERE name = 'IoT中台';
UPDATE system_menu SET name = '生态应用' WHERE name = '应用生态' AND path = 'isv-apps';
UPDATE system_menu SET name = '联调沙箱' WHERE name = '客户端沙箱' OR path = 'agent-sandbox';
UPDATE system_menu SET name = '渠道门户' WHERE name = '代理商工作台' OR path = 'partner-portal';
UPDATE system_menu SET name = '代理商户' WHERE name = '渠道代理商' OR path = 'aigw-partner';
UPDATE system_menu SET name = '商机报备' WHERE name = '商机报备锁定' OR path = 'aigw-partner-lead';
`

fs.writeFileSync(sqlPath, sqlContent, 'utf-8')
console.log(`[MENU-AUDITOR] Persisted format SQL to: ${sqlPath}`)
console.log(`[MENU-AUDITOR] Done! Total ${totalReplacements} entries synchronized.`)
