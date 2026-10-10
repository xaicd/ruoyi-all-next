---
description: 规格交付进度与门禁健康扫描 (Spec-Ops Check) - 逐阶段核查产物与缺陷
---
请核对指定规格或全盘的交付状态：
1. 若指定了规格名，执行：`npm run spec:check -- --spec <name>`；
2. 若未指定，执行全局健康扫描：`npm run specs:health`；
3. 输出 11 个交付阶段（从 selection、requirements 到 ops、implementation）的完成状态、质量门禁（G0~G5）以及缺陷清单（bugs.md）中待修复或未带复现用例的缺陷项。
