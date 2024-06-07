import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import { request } from 'tests/integration/global-hooks';
import { createProblem, createUser } from 'tests/integration/seeds';

describe('Problem:API:update', () => {
  it("admin should be able update problem 'status'", async () => {
    const fakePayload = {
      status: 'approved',
    };
    const problem = await createProblem();
    const user = await createUser({ role: 'admin' });
    const { status, body } = await request
      .patch(`/problems/${problem.id}`)
      .set('dev-user-id', user.id)
      .send(fakePayload);
    expect(status).eq(200);
    expect(body)
      .excludingEvery(['id', 'created_at', 'updated_at'])
      .deep.eq({
        ...problem,
        ...fakePayload,
      });
  });
  it("user should not be able update problem 'status'", async () => {
    const fakePayload = {
      status: 'approved',
    };
    const problem = await createProblem();
    const user = await createUser({ role: 'user' });
    const { status } = await request
      .patch(`/problems/${problem.id}`)
      .set('dev-user-id', user.id)
      .send(fakePayload);
    expect(status).eq(403);
  });
  it('user should be able update problem props', async () => {
    const fakePayload = {
      description: faker.lorem.words(),
    };
    const problem = await createProblem();
    const user = await createUser({ role: 'user' });
    const { status, body } = await request
      .patch(`/problems/${problem.id}`)
      .set('dev-user-id', user.id)
      .send(fakePayload);
    expect(status).eq(200);
    expect(body)
      .excludingEvery(['id', 'created_at', 'updated_at'])
      .deep.eq({
        ...problem,
        ...fakePayload,
      });
  });
});
