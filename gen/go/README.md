# Go RPC 契约桩

由 `npm run domain:contracts` 从 `rpc-actions.json` 生成，不要手改。

- 模块：`ruoyi/all-next/gen`
- 导入：`ruoyi/all-next/gen/<domain>/v1`
- 每个域一个 `Client`，方法路径与 TS `grpcMethodPath` 一致，例如 `/ruoyi.pay.v1.PayService/CreateOrder`
- 不依赖 `google.golang.org/grpc`。把 `Client.Invoke` 接到 HTTP、自研 NATS 或后续 gRPC 传输即可。

```go
client := &payv1.Client{Invoke: func(ctx context.Context, path string, in any) (string, error) {
    // 序列化 in，发到 path，返回 JSON 字符串
    return `{"id":"pay-order-1"}`, nil
}}
reply, err := client.CreateOrder(ctx, &payv1.CreateOrderRequest{AppId: "app-1", Amount: 9900})
```
