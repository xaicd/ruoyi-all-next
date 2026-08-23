const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'docs', 'skills', 'ruoyi-all-next');
const dstDir = path.join(__dirname, '..', '.agents', 'skills');

const updates = {
  'product-requirements': {
    authorities: [
      '- `AGENTS.md` §2 (15 原生域边界与定位)',
      '- `AGENTS.md` §5 (Domain-First 研发流程)',
      '- `AGENTS.md` §15 (用户对话与需求实时记录追溯)',
      '- `docs/guides/project-profile-bootstrap.md`',
      '- `docs/architecture/ruoyi-all-next-client-channels.md`',
      '- `docs/architecture/ruoyi-all-next-capability-matrix.md`'
    ]
  },
  'ui-design': {
    authorities: [
      '- `AGENTS.md` §3.2 (客户端包结构约束)',
      '- `AGENTS.md` §4.4 (权限与菜单可见性一致性)',
      '- `AGENTS.md` §6.1 (UI Framework 与 UI-UX-Pro-Max 治理)',
      '- `AGENTS.md` §14.4 (前端模板与对标规范)',
      '- `docs/architecture/ruoyi-all-next-client-channels.md`',
      '- `src/modules/shared/frontend/templates`'
    ]
  },
  'api-design': {
    authorities: [
      '- `AGENTS.md` §3.1 (分层架构契约)',
      '- `AGENTS.md` §3.3 (可替换后端与版本化契约边界)',
      '- `AGENTS.md` §4.1 (Route 薄层约束)',
      '- `AGENTS.md` §4.3 (Validator 与错误码契约)',
      '- `docs/guides/api-route-conventions.md`',
      '- `docs/specs/api-security-persistence-spec.md`'
    ]
  },
  'database-design': {
    authorities: [
      '- `AGENTS.md` §3.3 (数据库边界与 Kysely 仓储规范)',
      '- `AGENTS.md` §4.6 (事务与状态守卫规范)',
      '- `AGENTS.md` §6.1 (database-compatibility 治理)',
      '- `docs/architecture/ruoyi-all-next-database-compatibility.md`',
      '- Prisma schema + 版本化迁移（PostgreSQL 为默认真源）'
    ]
  },
  'architecture-design': {
    authorities: [
      '- `AGENTS.md` §1 (项目定位与复用基座)',
      '- `AGENTS.md` §3 (架构总览、目录约束与可替换后端边界)',
      '- `AGENTS.md` §6.1 (microservice-evolution 治理)',
      '- `docs/architecture/ruoyi-all-next-architecture.md`',
      '- `docs/architecture/ruoyi-all-next-microservice-governance.md`',
      '- `src/modules/shared/backend/constants/domain-catalog.json`'
    ]
  },
  'service-governance': {
    authorities: [
      '- `AGENTS.md` §3.3 (服务调用/超时重试/熔断/隔板/可靠事件总线)',
      '- `AGENTS.md` §4.5 (日志与审计规范)',
      '- `src/modules/shared/backend/constants/microservice-governance.json`',
      '- `src/modules/shared/backend/lib/broker-resilience.ts`',
      '- `src/modules/shared/backend/lib/rate-limiter.ts`',
      '- `src/modules/shared/backend/lib/trace-context.ts`'
    ]
  },
  'coding': {
    authorities: [
      '- `AGENTS.md` §4 (编码规范：Route/Service/Validator/权限/日志)',
      '- `AGENTS.md` §5 (Domain-First 研发流程六要素)',
      '- `AGENTS.md` §11 (代码规模与拆分约束)',
      '- `AGENTS.md` §14 (代码生成器架构规范与目录分层)',
      '- `docs/guides/service-design-patterns.md`',
      '- `docs/guides/api-route-conventions.md`'
    ]
  },
  'automated-testing': {
    authorities: [
      '- `AGENTS.md` §6 (能力同步与治理门禁)',
      '- `AGENTS.md` §8 (测试规范：关键路径/拒绝/回滚断言)',
      '- 域测试：`src/modules/<domain>/backend/services/__tests__/`'
    ]
  },
  'security': {
    authorities: [
      '- `AGENTS.md` §3.3 (服务身份与权限验证)',
      '- `AGENTS.md` §4.4 (权限码与角色规范)',
      '- `AGENTS.md` §4.5 (日志脱敏与敏感审计)',
      '- `AGENTS.md` §12 (常见安全禁止项)',
      '- `docs/specs/api-security-persistence-spec.md`',
      '- `src/modules/shared/backend/auth/`'
    ]
  },
  'devops': {
    authorities: [
      '- `AGENTS.md` §9 (本地开发与运行步骤)',
      '- `AGENTS.md` §10 (构建部署与发布门禁)',
      '- `deploy/README.md`',
      '- `deploy/docker-compose.prod.yml`'
    ]
  },
  'skill-authoring': {
    authorities: [
      '- `AGENTS.md` §6.1 (Skill Registry 强制治理规则)',
      '- `docs/skills/ruoyi-all-next/README.md`'
    ]
  }
};

for (const [skillName, cfg] of Object.entries(updates)) {
  const filePath = path.join(srcDir, skillName + '.SKILL.md');
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  
  const authSection = '## 权威\n\n' + cfg.authorities.join('\n');
  content = content.replace(/## 权威[\s\S]*?(?=\n##|$)/, authSection + '\n');
  
  fs.writeFileSync(filePath, content, 'utf8');
  
  const agentSkillDir = path.join(dstDir, skillName);
  if (!fs.existsSync(agentSkillDir)) fs.mkdirSync(agentSkillDir, { recursive: true });
  fs.writeFileSync(path.join(agentSkillDir, 'SKILL.md'), content, 'utf8');
  console.log('Updated and synced skill:', skillName);
}

// Also sync all remaining .SKILL.md (like database-compatibility, microservice-evolution, ui-framework-governance)
fs.readdirSync(srcDir).filter(f => f.endsWith('.SKILL.md')).forEach(file => {
  const skillName = file.replace(/\.SKILL\.md$/, '');
  const agentSkillDir = path.join(dstDir, skillName);
  if (!fs.existsSync(agentSkillDir)) fs.mkdirSync(agentSkillDir, { recursive: true });
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  fs.writeFileSync(path.join(agentSkillDir, 'SKILL.md'), content, 'utf8');
});

console.log('All skills fully synchronized with AGENTS.md');
