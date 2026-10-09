#!/usr/bin/env node

/**
 * @ruoyi/mcp-server entrypoint
 */

const path = require("node:path")

// 找到真实的 ruoyi-mcp-server.cjs 脚本位置
const serverScript = path.resolve(__dirname, "../../../scripts/mcp/ruoyi-mcp-server.cjs")

require(serverScript)
