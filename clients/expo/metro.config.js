// Expo 默认 Metro 配置（支持 pnpm monorepo 根依赖解析与 Web/Native export）
const { getDefaultConfig } = require("expo/metro-config")
const path = require("node:path")

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, "../..")

const config = getDefaultConfig(projectRoot)

// 1. 监控工作区所有关联目录
config.watchFolders = [workspaceRoot]

// 2. 指导 Metro 依序从工程和工作区根查找 node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
]

module.exports = config
