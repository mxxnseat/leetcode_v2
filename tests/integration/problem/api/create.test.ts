import { expect } from 'chai';
import { request } from 'tests/integration/global-hooks';
import { createUser } from 'tests/integration/seeds';

describe('Problem:API:create', () => {
  it('should create problem', async () => {
    const fakePayload = {
      title: 'Two sum',
      inputs: '[2,7,11,15]',
      algorithm: '()=>{}',
      description: '123',
    };
    const user = await createUser();
    const { status, body } = await request
      .post('/problems')
      .set('dev-user-id', user.id)
      .send(fakePayload);
    expect(status).eq(201);
    expect(body)
      .excludingEvery(['id', 'created_at', 'updated_at'])
      .deep.eq({
        ...fakePayload,
        status: 'pending',
        created_by: user.id,
      });
  });
  it('should not create problem if "dev-user-id" header not passed', async () => {
    const fakePayload = {
      title: 'Two sum',
      inputs: '[2,7,11,15]',
      algorithm: '()=>{}',
      description: '123',
    };
    const { status } = await request.post('/problems').send(fakePayload);
    expect(status).eq(401);
  });
});
