import { Metadata } from '@lib/metadata';
import { ICommand as NestICommand } from '@nestjs/cqrs';
import { Type, instanceToPlain, plainToInstance } from 'class-transformer';

export interface ICommand extends NestICommand {
  serialize(): string;
  metadata: Metadata;
}

export class Command implements ICommand {
  public serialize(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  @Type(() => Metadata)
  public readonly metadata: Metadata;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
  }

  public static deserialize(message: string): ICommand {
    return plainToInstance(this, message);
  }
}
