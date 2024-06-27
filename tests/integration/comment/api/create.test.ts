import { CommentCreatedEvent } from '@domain/comment/events';
import { faker } from '@faker-js/faker';
import { EventBus } from '@lib/modules/cqrs/event-bus';
import { expect } from 'chai';
import Sinon from 'sinon';
import { app, request } from 'tests/integration/global-hooks';
import {
  createComment,
  createProblem,
  createUser,
} from 'tests/integration/seeds';

describe('Comment:API:create', () => {
  it('should create comment', async () => {
    const user = await createUser();
    const problem = await createProblem({ created_by: user.id });
    const fakePayload = {
      problem_id: problem.id,
      text: faker.lorem.words(),
    };
    const { status, body } = await request
      .post('/comments')
      .set('dev-user-id', user.id)
      .send(fakePayload);
    expect(status).eq(201);
    const eventBus = app.get<Sinon.SinonStubbedInstance<EventBus>>(EventBus);
    const publish = eventBus.publish;
    expect(publish).calledOnce;
    expect(publish.getCall(0).firstArg).instanceOf(CommentCreatedEvent);
    expect(body).excludingEvery(['id', 'created_at', 'updated_at']).deep.eq({
      text: fakePayload.text,
      problem: fakePayload.problem_id,
      created_by: user.id,
    });
  });
});
