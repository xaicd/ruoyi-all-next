---
name: microservice-evolution
description: 域从模块化单体向可拆分单体、再到微服务的演进设计：阶段判定（A/B/C）、跨域超时重试熔断、拆分顺序与回滚路径。涉及域拆分、独立发布或阶段演进时启用。
---

# microservice-evolution

## Purpose

指导 all-next 领域从模块化单体向可拆分单体、再到微服务的演进设计。

## Use When

1. 新域需要声明演进阶段（A/B/C）。
2. 出现独立发布、高并发或异构数据源诉求。
3. 需要输出拆分与回滚策略。

## Checklist

1. 明确阶段：A 模块化单体 / B 可拆分单体 / C 微服务。
2. 给出跨域调用的超时、重试、熔断、幂等策略。
3. 给出拆分顺序、数据边界、回滚路径。
4. 回写治理声明 SplitNote 与 TestRefs。
