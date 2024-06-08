import { expect } from 'chai';
import { request } from 'tests/integration/global-hooks';
import { createJudge, createUser } from 'tests/integration/seeds';

describe('Judge:API:list', () => {
  it("should list user's judges only", async () => {
    const user = await createUser();
    const firstJudge = await createJudge({ user: user.id });
    await createJudge();
    const { status, body } = await request
      .get('/judges')
      .set('dev-user-id', user.id);
    expect(status).eq(200);
    expect(body).deep.eq({
      data: [firstJudge],
    });
  });
});
