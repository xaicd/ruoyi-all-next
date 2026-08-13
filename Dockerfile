# ============================================================
# ruoyi-all-next 多阶段构建（standalone 模式）
# ============================================================

# Stage 1: 依赖安装
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Stage 2: 构建
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma Client is generated during the image build; migrations run separately before app replicas start.
RUN npx prisma generate

# Next.js build（standalone 模式）
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: 生产运行
FROM node:20-alpine AS runner
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
