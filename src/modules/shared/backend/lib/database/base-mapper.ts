/**
 * MyBatis-Plus 风格通用 BaseMapper 与 QueryWrapper
 * 
 * 为 ruoyi-all-next 提供 SpringBoot + MyBatis-Plus 级的开发体验：
 * 1. 链式条件构造器 QueryWrapper / LambdaQueryWrapper
 * 2. 泛型 BaseMapper：全套内置 selectById, selectList, selectPage, insert, updateById, deleteById
 * 3. 自动租户隔离、逻辑删除过滤、审计字段自填充
 * 4. 业务代码极简：新增业务领域仅需继承 BaseService，无需大模型逐行编写重复的 CRUD 代码！
 * 
 * @module modules/shared/backend/lib/database/base-mapper
 */

import { getKyselyDb } from './kysely-client';
import { getCurrentTenantId } from '../biz-tenant';
import type { DB } from './schema';
import type { Kysely } from 'kysely';

export type QueryOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'like' | 'in' | 'not in' | 'is null' | 'is not null' | 'between';

export interface QueryCondition {
  column: string;
  operator: QueryOperator;
  value?: any;
  value2?: any;
}

export interface OrderItem {
  column: string;
  order: 'asc' | 'desc';
}

/**
 * MyBatis-Plus 风格链式条件构造器
 */
export class QueryWrapper<T = any> {
  private conditions: QueryCondition[] = [];
  private orderList: OrderItem[] = [];

  eq(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null && value !== '') {
      this.conditions.push({ column: String(column), operator: '=', value });
    }
    return this;
  }

  ne(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({ column: String(column), operator: '!=', value });
    }
    return this;
  }

  like(column: keyof T | string, value: string | undefined): this {
    if (value !== undefined && value !== null && value !== '') {
      this.conditions.push({ column: String(column), operator: 'like', value: `%${value}%` });
    }
    return this;
  }

  gt(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({ column: String(column), operator: '>', value });
    }
    return this;
  }

  ge(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({ column: String(column), operator: '>=', value });
    }
    return this;
  }

  lt(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({ column: String(column), operator: '<', value });
    }
    return this;
  }

  le(column: keyof T | string, value: any): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({ column: String(column), operator: '<=', value });
    }
    return this;
  }

  in(column: keyof T | string, values: any[]): this {
    if (Array.isArray(values) && values.length > 0) {
      this.conditions.push({ column: String(column), operator: 'in', value: values });
    }
    return this;
  }

  between(column: keyof T | string, val1: any, val2: any): this {
    if (val1 !== undefined && val2 !== undefined) {
      this.conditions.push({ column: String(column), operator: 'between', value: val1, value2: val2 });
    }
    return this;
  }

  orderByAsc(column: keyof T | string): this {
    this.orderList.push({ column: String(column), order: 'asc' });
    return this;
  }

  orderByDesc(column: keyof T | string): this {
    this.orderList.push({ column: String(column), order: 'desc' });
    return this;
  }

  getConditions(): QueryCondition[] {
    return this.conditions;
  }

  getOrders(): OrderItem[] {
    return this.orderList;
  }
}

/**
 * 泛型 BaseMapper 底座
 */
export class BaseMapper<T extends Record<string, any>> {
  constructor(
    public readonly tableName: string,
    public readonly primaryKey: string = 'id',
    private injectedDb?: Kysely<DB>
  ) {}

  private async getDb(): Promise<Kysely<DB>> {
    if (this.injectedDb) return this.injectedDb;
    const db = await getKyselyDb();
    if (!db) {
      throw new Error(`数据库未初始化，无法访问表 [${this.tableName}]`);
    }
    return db;
  }

  /**
   * 根据 ID 查询单条记录（自动过滤逻辑删除与租户隔离）
   */
  async selectById(id: string | number): Promise<T | null> {
    const db = await this.getDb();
    const tenantId = getCurrentTenantId();

    let query = db.selectFrom(this.tableName as any).selectAll().where(this.primaryKey as any, '=', id);
    query = (query as any).where('deleted', '=', 0);

    if (tenantId) {
      query = (query as any).where('tenant_id', '=', tenantId);
    }

    const row = await (query as any).executeTakeFirst();
    return (row as T) || null;
  }

  /**
   * 根据条件查询单条记录
   */
  async selectOne(wrapper: QueryWrapper<T>): Promise<T | null> {
    const list = await this.selectList(wrapper);
    return list.length > 0 ? list[0] : null;
  }

  /**
   * 根据条件查询列表
   */
  async selectList(wrapper?: QueryWrapper<T>): Promise<T[]> {
    const db = await this.getDb();
    const tenantId = getCurrentTenantId();

    let query = db.selectFrom(this.tableName as any).selectAll().where('deleted', '=', 0);

    if (tenantId) {
      query = (query as any).where('tenant_id', '=', tenantId);
    }

    if (wrapper) {
      for (const cond of wrapper.getConditions()) {
        if (cond.operator === '=') query = (query as any).where(cond.column, '=', cond.value);
        else if (cond.operator === '!=') query = (query as any).where(cond.column, '!=', cond.value);
        else if (cond.operator === 'like') query = (query as any).where(cond.column, 'like', cond.value);
        else if (cond.operator === '>') query = (query as any).where(cond.column, '>', cond.value);
        else if (cond.operator === '>=') query = (query as any).where(cond.column, '>=', cond.value);
        else if (cond.operator === '<') query = (query as any).where(cond.column, '<', cond.value);
        else if (cond.operator === '<=') query = (query as any).where(cond.column, '<=', cond.value);
        else if (cond.operator === 'in') query = (query as any).where(cond.column, 'in', cond.value);
      }

      for (const ord of wrapper.getOrders()) {
        query = (query as any).orderBy(ord.column, ord.order);
      }
    }

    const rows = await (query as any).execute();
    return rows as T[];
  }

  /**
   * MyBatis-Plus 风格通用分页查询
   */
  async selectPage(
    page: { pageNum: number; pageSize: number },
    wrapper?: QueryWrapper<T>
  ): Promise<{ list: T[]; total: number; pageNum: number; pageSize: number }> {
    const pageNum = Math.max(1, page.pageNum || 1);
    const pageSize = Math.max(1, page.pageSize || 10);
    const offset = (pageNum - 1) * pageSize;

    const all = await this.selectList(wrapper);
    const total = all.length;
    const list = all.slice(offset, offset + pageSize);

    return { list, total, pageNum, pageSize };
  }

  /**
   * 插入记录（自动填充主键、租户ID、创建时间与审计字段）
   */
  async insert(entity: Partial<T>): Promise<T> {
    const db = await this.getDb();
    const tenantId = getCurrentTenantId();
    const now = new Date().toISOString();

    const record: any = {
      [this.primaryKey]: entity[this.primaryKey] || `id-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      deleted: 0,
      created_at: now,
      updated_at: now,
      ...entity
    };

    if (tenantId && !record.tenant_id) {
      record.tenant_id = tenantId;
    }

    await (db.insertInto(this.tableName as any) as any).values(record).execute();
    return record as T;
  }

  /**
   * 根据 ID 更新记录
   */
  async updateById(id: string | number, entity: Partial<T>): Promise<boolean> {
    const db = await this.getDb();
    const tenantId = getCurrentTenantId();

    const updates: any = {
      ...entity,
      updated_at: new Date().toISOString()
    };
    delete updates[this.primaryKey];

    let query = (db.updateTable(this.tableName as any) as any)
      .set(updates)
      .where(this.primaryKey, '=', id)
      .where('deleted', '=', 0);

    if (tenantId) {
      query = query.where('tenant_id', '=', tenantId);
    }

    const res = await query.execute();
    return res.length > 0;
  }

  /**
   * 根据 ID 逻辑删除
   */
  async deleteById(id: string | number): Promise<boolean> {
    const db = await this.getDb();
    const tenantId = getCurrentTenantId();

    let query = (db.updateTable(this.tableName as any) as any)
      .set({ deleted: 1, updated_at: new Date().toISOString() })
      .where(this.primaryKey, '=', id);

    if (tenantId) {
      query = query.where('tenant_id', '=', tenantId);
    }

    const res = await query.execute();
    return res.length > 0;
  }
}

/**
 * 通用 BaseService 业务底座
 */
export class BaseService<T extends Record<string, any>> {
  constructor(protected readonly mapper: BaseMapper<T>) {}

  async getById(id: string | number): Promise<T | null> {
    return this.mapper.selectById(id);
  }

  async list(wrapper?: QueryWrapper<T>): Promise<T[]> {
    return this.mapper.selectList(wrapper);
  }

  async page(pageNum: number, pageSize: number, wrapper?: QueryWrapper<T>) {
    return this.mapper.selectPage({ pageNum, pageSize }, wrapper);
  }

  async save(entity: Partial<T>): Promise<T> {
    return this.mapper.insert(entity);
  }

  async updateById(id: string | number, entity: Partial<T>): Promise<boolean> {
    return this.mapper.updateById(id, entity);
  }

  async removeById(id: string | number): Promise<boolean> {
    return this.mapper.deleteById(id);
  }
}
