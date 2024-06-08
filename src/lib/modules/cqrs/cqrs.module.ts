import { DynamicModule, Module, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from './command-bus';
import { QueryBus, UnhandledExceptionBus, IEvent } from '@nestjs/cqrs';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';

@Module({
  providers: [
    CommandBus,
    EventBus,
    UnhandledExceptionBus,
    EventPublisher,
    ExplorerService,
  ],
  exports: [CommandBus, EventBus, UnhandledExceptionBus, EventPublisher],
})
export class CqrsModule<EventBase extends IEvent = IEvent>
  implements OnApplicationBootstrap
{
  static forRoot(): DynamicModule {
    return {
      module: CqrsModule,
      global: true,
    };
  }

  constructor(
    private readonly explorerService: ExplorerService<EventBase>,
    private readonly eventBus: EventBus<EventBase>,
    private readonly commandBus: CommandBus,
  ) {}

  onApplicationBootstrap() {
    const { events, sagas, commands } = this.explorerService.explore();

    this.eventBus.register(events);
    this.commandBus.register(commands);
    this.eventBus.registerSagas(sagas);
  }
}
