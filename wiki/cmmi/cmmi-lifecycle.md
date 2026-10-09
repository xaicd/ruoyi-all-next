# CMMI 百科：01~09 全生命周期工程规范与 7 类物理交付资产

> 对应标准：CMMI V2.0 / V3.0 (DEV + SVC 模型) / docs/architecture/CMMI-PROCESS-ASSETS-AND-DELIVERY-STANDARD.md

## 一、 全生命周期九大阶段
1. **01_management (立项与决策)**：DAR 加权权衡矩阵、Brief 任务立项、估算模型；
2. **02_requirements (需求工程)**：IEEE 29148 / EARS 5态无歧义需求规格说明 (SRS/RTM)；
3. **03_design (系统与架构设计)**：MADR 架构决策记录、Archify 交互式架构图谱、OpenAPI 3.1 契约；
4. **04_implementation (构造与编码)**：第一方业务插件隔离、BaseMapper 泛型引擎、1 Task = 1 Commit；
5. **05_verification (验证与打假)**：SpaceX 级真实数据库驱动测试、Stryker 变异测试打假 (MSI $ge 85%$)；
6. **06_quality_assurance (质量与配置审计)**：20 道自动化门禁全绿、CMMI PPQA、FCA/PCA 配置审计；
7. **07_release (发布与网关)**：Traefik 边缘网关、Docker 容器编排、自动回滚 Runbook；
8. **08_sre (站点可靠性与安全)**：Google SRE SLI/SLO 矩阵、多燃烧率告警、Strix 60k★ 自主红队渗透；
9. **09_operations (持续运营与平账)**：复式记账守卫 ($sum	ext{Debit}equivsum	ext{Credit}$)、三方对账与长短款差错冲正。

## 二、 交付哲学：No Artifact, No Done
严禁口头声明完工，每个任务必须落地 7 类物理资产之一，并附带退出码为 0 的可核验凭证。
