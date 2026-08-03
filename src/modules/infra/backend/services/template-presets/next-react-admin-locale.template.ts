export const nextReactAdminLocaleTemplate = `export const {{entityName}}LocaleZhCN = {
  title: "{{entityName}} 管理",
  actions: {
    create: "新建",
    edit: "编辑",
    remove: "删除",
    search: "查询",
    reset: "重置",
  },
  fields: {
    name: "名称",
    status: "状态",
    createdAt: "创建时间",
    updatedAt: "更新时间",
  },
  message: {
    loadFailed: "数据加载失败",
    saveSuccess: "保存成功",
    saveFailed: "保存失败",
  },
} as const
`