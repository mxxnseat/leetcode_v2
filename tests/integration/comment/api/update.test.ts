import { CommentUpdatedEvent } from '@domain/comment/events';
import { faker } from '@faker-js/faker';
import { EventBus } from '@lib/modules/cqrs/event-bus';
import { expect } from 'chai';
import Sinon from 'sinon';
import { app, request } from 'tests/integration/global-hooks';
import { createComment, createUser } from 'tests/integration/seeds';

describe('Comment:API:update', () => {
  it('should update comment', async () => {
    const user = await createUser();
    const comment = await createComment({ created_by: user.id });
    const fakePayload = {
      text: faker.lorem.words(),
    };
    const { status, body } = await request
      .patch(`/comments/${comment.id}`)
      .set('dev-user-id', user.id)
      .send(fakePayload);
    expect(status).eq(200);
    const eventBus = app.get<Sinon.SinonStubbedInstance<EventBus>>(EventBus);
    const publish = eventBus.publish;
    expect(publish).calledOnce;
    expect(publish.getCall(0).firstArg).instanceOf(CommentUpdatedEvent);
    expect(body)
      .excludingEvery(['updated_at'])
      .deep.eq({
        ...comment,
        text: fakePayload.text,
      });
  });
  it('should not update comment by non created by user', async () => {
    const user = await createUser();
    const comment = await createComment();
    const fakePayload = {
      text: faker.lorem.words(),
    };
    const { status } = await request
      .patch(`/comments/${comment.id}`)
      .set('dev-user-id', user.id)
      .send(fakePayload);
    expect(status).eq(403);
  });
});
