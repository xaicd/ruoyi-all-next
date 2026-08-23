# uni-app 包

- 包名：`@ruoyi/client-uniapp`
- 渠道 id：`uniapp`
- 源码根：`src/`
- `pages/` 只登记路由，实现必须在 `src/modules/<domain>/pages`

```text
clients/uniapp/
  package.json
  pages/                # 路由壳（uni-app 要求）
  src/
    app/
    shared/
    modules/<domain>/{api,models,pages,components}
```

不要在 `pages/` 里堆业务逻辑。当前仅有目录标准，没有可运行工程。
