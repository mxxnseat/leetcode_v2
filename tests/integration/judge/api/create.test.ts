import SinonChai from 'sinon-chai';
import { faker } from '@faker-js/faker';
import { EventBus } from '@lib/modules/cqrs/event-bus';
import chai, { expect } from 'chai';
import { app, request } from 'tests/integration/global-hooks';
import { createProblem, createUser } from 'tests/integration/seeds';
import { JudgeCreatedEvent } from '@domain/judge/events';
import Sinon from 'sinon';

describe('Judge:API:create', () => {
  it('should create judge and publish "JudgeCreatedEvent"', async () => {
    const problem = await createProblem();
    const fakePayload = {
      problem_id: problem.id,
      algorithm: faker.lorem.words(),
    };
    const user = await createUser();
    const { status, body } = await request
      .post('/judges')
      .set('dev-user-id', user.id)
      .send(fakePayload);
    expect(status).eq(201);
    const eventBus = app.get<Sinon.SinonStubbedInstance<EventBus>>(EventBus);
    const publish = eventBus.publish;
    expect(publish).calledOnce;
    expect(publish.getCall(0).firstArg).instanceOf(JudgeCreatedEvent);
    expect(body).excludingEvery(['id', 'created_at', 'updated_at']).deep.eq({
      success: false,
      failed_reason: null,
      problem: fakePayload.problem_id,
      algorithm: fakePayload.algorithm,
      user: user.id,
    });
  });
  it('user should be able create judge and publish "JudgeCreatedEvent"', async () => {
    const problem = await createProblem();
    const fakePayload = {
      problem_id: problem.id,
      algorithm: faker.lorem.words(),
    };
    const user = await createUser({ role: 'user' });
    const { status, body } = await request
      .post('/judges')
      .set('dev-user-id', user.id)
      .send(fakePayload);
    expect(status).eq(201);
    const eventBus = app.get<Sinon.SinonStubbedInstance<EventBus>>(EventBus);
    const publish = eventBus.publish;
    expect(publish).calledOnce;
    expect(publish.getCall(0).firstArg).instanceOf(JudgeCreatedEvent);
    expect(body).excludingEvery(['id', 'created_at', 'updated_at']).deep.eq({
      success: false,
      failed_reason: null,
      problem: fakePayload.problem_id,
      algorithm: fakePayload.algorithm,
      user: user.id,
    });
  });
});
