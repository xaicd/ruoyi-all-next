import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    // 必须包含 packages/** —— 各域与 shared 的测试已随代码迁到 packages/ 下，
    // 漏掉这条会静默地少跑一大半测试而仍然显示通过（实测 300+ -> 29）。
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts", "test/**/*.test.ts", "packages/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // 必须与 tsconfig 的 paths 保持一致（Vitest 不读 tsconfig paths）。
      // 各域与 shared 已迁到 packages/ 下；顺序也重要 —— 更具体的放前面。
      "@/modules/shared": path.resolve(__dirname, "packages/shared"),
      // 已改造成第一方插件的域（目录搬到了 packages/plugins/plugin-*）
      "@/modules/pay": path.resolve(__dirname, "packages/plugins/plugin-pay"),
      "@/modules/report": path.resolve(__dirname, "packages/plugins/plugin-report"),
      "@/modules": path.resolve(__dirname, "packages/domains"),
      "@": path.resolve(__dirname, "src"),
      "@prisma/data": path.resolve(__dirname, "prisma/data"),
    },
  },
})
