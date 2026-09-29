# ============================================================
# ruoyi-all-next 多阶段构建（standalone 模式）
# ============================================================

# Stage 1: 依赖安装
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc ./
# 构建工具只装在 deps 阶段（最终 runner 镜像不含它们）。
# 原因: better-sqlite3 的安装脚本是 `prebuild-install || node-gyp rebuild`，
# 一旦从 GitHub 拉预编译包超时, 就会回退到源码编译 —— 而 alpine 默认没有
# python3/make/g++, 于是整个镜像构建失败。装上这三样让回退路径真正可用,
# 构建就不再单点依赖一次外部下载。
RUN apk add --no-cache python3 make g++
# npm workspaces 要求各成员的 package.json 在 install 时已存在，
# 否则 npm ci 会因 workspace glob 指向不存在的目录而失败。
# 只拷 package.json（源码与 node_modules 由 .dockerignore / 后续 COPY 处理）。
COPY packages/plugins/sdk/package.json ./packages/plugins/sdk/package.json
COPY packages/plugins/examples/hello-world/package.json ./packages/plugins/examples/hello-world/package.json
# 包管理器切到 pnpm（corepack 用 package.json 的 packageManager 字段选版本）。
# --frozen-lockfile: CI/镜像构建必须用锁文件，不允许隐式升级依赖。
RUN corepack enable && corepack prepare --activate
RUN pnpm install --frozen-lockfile
# npm workspaces 会在 node_modules/@ruoyi 下建立指向 ../../packages/... 的符号链接。
# BuildKit 的 COPY 解析「落在被复制目录之外」的链接时会报
# "evalSymlinksInScope: too many links"，导致下一阶段的 COPY --from=deps 失败。
# 应用构建不依赖这些插件包（plugin SDK 只给插件作者使用），故在 deps 层裁掉。
RUN rm -rf node_modules/@ruoyi node_modules/.pnpm/node_modules/@ruoyi

# Stage 2: 构建
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma Client is generated during the image build; migrations run separately before app replicas start.
RUN npx prisma generate

# Next.js build（standalone 模式）
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: 生产运行
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3100
ENV HOSTNAME="0.0.0.0"

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制 standalone 产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next-ruoyi/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next-ruoyi/static ./.next-ruoyi/static

# Prisma schema（运行时 migration 可能需要）
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3100

CMD ["node", "server.js"]
