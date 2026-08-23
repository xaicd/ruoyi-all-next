# 跨平台 PC 客户端包

- 包名：`@ruoyi/client-desktop-pc`
- 渠道 id：`desktop-pc`
- 源码根：`src/`
- 壳：`src-tauri/`（只做窗口、托盘、更新）

```text
clients/desktop-pc/
  package.json
  src-tauri/            # Tauri 壳，不是业务域
  src/
    app/
    shared/
    modules/<domain>/{api,models,pages,components}
```

优先嵌入已交付的管理端；若做原生页，仍按域名分目录。当前仅有目录标准，没有可运行壳。
