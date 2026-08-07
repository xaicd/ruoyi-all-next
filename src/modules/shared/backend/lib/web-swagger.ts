type SwaggerDoc = {
  openapi: string
  info: {
    title: string
    version: string
    description: string
  }
  tags: Array<{ name: string; description: string }>
}

export function buildAdminSwaggerDoc(): SwaggerDoc {
  return {
    openapi: "3.0.3",
    info: {
      title: "ruoyi-all-next admin api",
      version: "0.1.0",
      description: "mini migration swagger baseline",
    },
    tags: [
      { name: "system", description: "system core apis" },
      { name: "infra", description: "infra core apis" },
    ],
  }
}
