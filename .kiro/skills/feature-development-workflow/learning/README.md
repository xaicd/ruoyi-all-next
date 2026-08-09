# 功能开发工作流学习区

此目录将功能开发与调试中的高质量反馈沉淀为可复核的本地经验，采用“原始记录 → 活跃经验 → 永久规范”的分层机制。它借鉴了 OpenClaw 社区的选择性捕获、重复模式晋升和过期降级思路，但不允许自动篡改项目强制规则。

## 自动化边界

- `entries.jsonl`：只记录四类高信号事件：用户纠正、验证/工具失败的已确认根因、经验证的新发现、稳定偏好。
- `active-rules.md`：同一 `pattern` 累积 3 条证据且最近 45 天仍有证据时自动生成，作为后续同类任务的补充检查项。
- `promotion-candidates.md`：列出满足阈值的候选项；敏感项及所有永久规则升级均须人工批准。
- 活跃经验失效后自动从 `active-rules.md` 降级，但原始记录保留审计链路；不自动删除历史。
- `SKILL.md`、AGENTS.md、权限、资金、生产操作、安全和审批约束永远不会由脚本自动修改。

运行时文件已在 `.gitignore` 中忽略，避免把偶发本地调试噪音带入版本控制；经人工批准的通用规则才应以可审查的变更提交到 `SKILL.md` 或项目规范。

## 使用方式

每个功能或调试任务结束时，仅在存在可复用事实时记录一条：

```bash
npm run workflow:learning:record -- \
  --type failure \
  --pattern api-response-contract \
  --scope merchant-order-debug \
  --summary "列表接口遗漏 data 包裹，api-client 解包后得到 undefined" \
  --prevention "新增或重写接口前检查成功响应为 { success: true, data }" \
  --evidence "api-route-coverage 与定向接口测试通过"
```

可用 `--sensitivity sensitive` 标记资金、权限、安全、个人信息或生产数据相关条目；这类条目只进入人工审查，不会自动成为活跃规则。

```bash
npm run workflow:learning:review
npm run workflow:learning:status
```

记录中禁止出现密码、Token、Cookie、完整手机号、身份证号、银行卡号、支付凭证、原始请求体或生产数据。脚本会拒绝明显的敏感字段词，但记录者仍须先脱敏。
