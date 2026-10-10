---
description: Spec-Kit 概念论证与可行性评估 (Idea Assessment / DAR Decision Analysis)
---
在正式创建 Spec 前，对模糊需求或架构构想进行立项前评估：
1. 分析核心痛点、业务目标与非目标；
2. 调度 `dar-decision-matrix`（决策分析与权衡）技能与 `ears-spec-writer` 技能；
3. 从四个维度进行综合论证：
   - 必要性：该功能如果彻底不做，系统或业务会瘫痪吗？
   - ROI 评估：自研、复用存量领域模型、还是集成开源标准方案？
   - 架构冲击：是否破坏 17 领域边界？涉及哪些表与跨域 Facade？
   - 复杂度与风险：工期估算、可能遇到的单点并发与数据隔离风险。
4. 给出最终结论：PROCEED（建议立项，进入 `/speckit.specify`） / REVISE（需补齐前提） / REJECT（驳回需求）。
