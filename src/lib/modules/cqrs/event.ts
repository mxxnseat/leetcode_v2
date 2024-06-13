import { Metadata } from '@lib/metadata';
import { IEvent } from '@nestjs/cqrs';
import { Type } from 'class-transformer';

export class Event implements IEvent {
  @Type(() => Metadata)
  public readonly metadata: Metadata;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
  }
}
