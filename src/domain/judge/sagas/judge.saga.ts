import { ICommand, Saga, IEvent, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import { JudgeCreatedEvent } from '../events';
import { JudgeCommand } from '../commands/impl/judge.command';

export class JudgeSaga {
  @Saga()
  public judgeCreated($events: Observable<IEvent>): Observable<ICommand> {
    return $events.pipe(
      ofType(JudgeCreatedEvent),
      map(({ judge }) => new JudgeCommand(judge)),
    );
  }
}
