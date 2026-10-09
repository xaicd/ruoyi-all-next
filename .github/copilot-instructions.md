# GitHub Copilot Instructions for ruoyi-all-next

This workspace is `ruoyi-all-next`, an enterprise-grade fullstack platform built on Next.js 16 + React 19 + TypeScript 5.

## Architecture & Technology Stack
- Next.js 16 (App Router) + React 19 + TypeScript 5
- Database: Kysely query builder + SQLite (local development) / PostgreSQL (production)
- Multi-tenancy: Strictly obtain tenant scope from `getCurrentTenantId()`, never pass explicit tenantId across layers.
- Project Initialization: Use `npm run project:init` to customize project names, titles, and remotes.
- Quality Gates: Must pass `npm run check` and `npm run test:unit`.
- Detailed Rules: Review `AGENTS.md` and `llms.txt`.
