/**
 * L1 单元测试: MyBatis-Plus 风格 QueryWrapper 链式条件与排序构造器
 */

import { describe, it, expect } from 'vitest';
import { QueryWrapper } from '../../src/modules/shared/backend/lib/database/base-mapper';

interface MockUser {
  id: string;
  username: string;
  nickname: string;
  age: number;
  status: string;
}

describe('L1 Unit: MyBatis-Plus QueryWrapper', () => {
  it('正确构建 eq, like, in, between 条件', () => {
    const qw = new QueryWrapper<MockUser>()
      .eq('status', 'ACTIVE')
      .like('nickname', '张')
      .in('age', [20, 25, 30])
      .between('age', 18, 60)
      .orderByDesc('id');

    const conds = qw.getConditions();
    expect(conds).toHaveLength(4);

    expect(conds[0]).toEqual({ column: 'status', operator: '=', value: 'ACTIVE' });
    expect(conds[1]).toEqual({ column: 'nickname', operator: 'like', value: '%张%' });
    expect(conds[2]).toEqual({ column: 'age', operator: 'in', value: [20, 25, 30] });
    expect(conds[3]).toEqual({ column: 'age', operator: 'between', value: 18, value2: 60 });

    const orders = qw.getOrders();
    expect(orders).toHaveLength(1);
    expect(orders[0]).toEqual({ column: 'id', order: 'desc' });
  });

  it('自动过滤 undefined 和空字符串条件', () => {
    const qw = new QueryWrapper<MockUser>()
      .eq('username', undefined)
      .eq('nickname', '')
      .eq('status', 'ACTIVE');

    const conds = qw.getConditions();
    expect(conds).toHaveLength(1);
    expect(conds[0].column).toBe('status');
  });
});
