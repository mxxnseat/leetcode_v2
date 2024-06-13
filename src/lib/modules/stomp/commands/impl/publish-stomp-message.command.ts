import { Metadata } from '@lib/metadata';
import { Command } from '@lib/modules/cqrs/command';
import { Event } from '@lib/modules/cqrs/event';

export class PublishStompMessageCommand extends Command {
  constructor(public readonly event: Event, metadata: Metadata) {
    super(metadata);
  }
}
