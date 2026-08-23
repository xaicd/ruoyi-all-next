# C 端 H5 包

- 包名：`@ruoyi/client-h5`
- 渠道 id：`h5`
- API：`/api/v1/app`
- 源码根：`src/`

```text
clients/h5/
  package.json
  src/
    app/        # 启动、路由、主题
    shared/     # http、登录态、错误码、品牌
    modules/
      mall/     # 与后端域名同名，按需增加
        api/
        models/
        pages/
        components/
```

新增后端域时，在 `src/modules/<domain>/` 建同名目录，不要把页面堆进 `src/app` 或 `src/shared`。当前仅有目录标准，没有可运行页面。
