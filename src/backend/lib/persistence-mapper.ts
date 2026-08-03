type MapperPage<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export function mapperPage<T>(items: T[], page: number, pageSize: number): MapperPage<T> {
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  }
}
