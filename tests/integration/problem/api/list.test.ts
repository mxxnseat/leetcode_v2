import { expect } from 'chai';
import { request } from 'tests/integration/global-hooks';
import { createProblem, createUser } from 'tests/integration/seeds';

describe('Problem:API:list', () => {
  it('admin should list all problems', async () => {
    const user = await createUser({ role: 'admin' });
    const pendingProblem = await createProblem({
      status: 'pending',
      created_at: 1,
    });
    const approvedProblem = await createProblem({
      status: 'approved',
      created_at: 2,
    });
    const canceledProblem = await createProblem({
      status: 'canceled',
      created_at: 3,
    });
    const { status, body } = await request
      .get('/problems')
      .set('dev-user-id', user.id)
      .query({
        sort: '+created_at',
      });
    expect(status).eq(200);
    expect(body).deep.eq({
      data: [pendingProblem, approvedProblem, canceledProblem],
    });
  });
  it('user should list only approved problems', async () => {
    const user = await createUser({ role: 'user' });
    await createProblem({
      status: 'pending',
      created_at: 1,
    });
    await createProblem({
      status: 'canceled',
      created_at: 3,
    });
    const approvedProblem = await createProblem({
      status: 'approved',
      created_at: 2,
    });

    const { status, body } = await request
      .get('/problems')
      .set('dev-user-id', user.id);
    expect(status).eq(200);
    expect(body).deep.eq({
      data: [approvedProblem],
    });
  });
});
