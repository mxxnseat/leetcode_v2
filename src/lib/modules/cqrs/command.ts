import { Metadata } from '@lib/metadata';
import { ICommand as NestICommand } from '@nestjs/cqrs';
import { Type, instanceToPlain, plainToInstance } from 'class-transformer';

export interface ICommand extends NestICommand {
  serialize(): string;
  metadata: Metadata;
  name: string;
}

export class Command implements ICommand {
  public serialize(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  public readonly name: string;

  @Type(() => Metadata)
  public readonly metadata: Metadata;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
    this.name = this.constructor.name;
  }

  public static deserialize(message: string): ICommand {
    return plainToInstance(this, message);
  }
}
