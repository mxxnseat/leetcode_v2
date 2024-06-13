import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import { JudgeCreatedEvent } from '../events';
import { JudgeCommand } from '../commands/impl';
import { Command } from '@lib/modules/cqrs/command';

export class JudgeSaga {
  @Saga()
  public judgeCreated($events: Observable<Event>): Observable<Command> {
    return $events.pipe(
      ofType(JudgeCreatedEvent),
      map(({ judge, metadata }) => new JudgeCommand(judge, metadata)),
    );
  }
}
