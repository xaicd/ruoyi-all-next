# 开发任务分解与执行 DAG (Tasks DAG)

> **阶段标记**：规划阶段 (Planning Phase)
> **状态收敛**：`PLAN_APPROVED`
> **推导关系**：由 `design.md` 单向严格推导生成，用于驱动开发阶段实施。

---

## 1. 任务依赖 DAG 拓扑图
```
[Task 1: DAL/Schema 建模] ──► [Task 2: Service/Repository] ──► [Task 3: API & 前端页面]
```

## 2. 细分任务清单 (Task Breakdown)

### 任务组 A: 基础数据层
- [ ] Task 1.1: 编写 Mongoose/Kysely Schema 与迁移脚本
- [ ] Task 1.2: 编写 L1 单元测试骨架

### 任务组 B: 业务服务层
- [ ] Task 2.1: 实现 Service 业务逻辑与事务守卫
- [ ] Task 2.2: 挂载 RBAC 权限码与操作审计

### 任务组 C: 表现层与测试
- [ ] Task 3.1: 编写 RESTful API Route 与双端注册
- [ ] Task 3.2: 编写前端 Page 与 CRUD 表单弹窗
- [ ] Task 3.3: 编写 L2 集成测试与 L3/L4 Playwright 探针
