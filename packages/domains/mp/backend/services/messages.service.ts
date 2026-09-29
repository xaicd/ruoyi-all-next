/**
 * MessagesService - Auto-generated stub
 */

export class MessagesService {
  static async list(input: any) {
    return { items: [], total: 0, page: input.page, pageSize: input.pageSize }
  }

  static async create(...args: any[]) {
    return { id: String(Date.now()) }
  }

  static async update(...args: any[]) {
    return { success: true }
  }

  static async delete(id: string) {
    return { success: true }
  }

  static async get(id: string) {
    return { id }
  }

  static async page(...args: any[]) {
    return {}
  }

}
