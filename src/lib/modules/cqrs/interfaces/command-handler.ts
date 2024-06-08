import { ICommand } from '@nestjs/cqrs';
import { Job } from 'bullmq';

export interface ICommandHandler<
  TCommand extends ICommand = any,
  TResult = any,
> {
  /**
   * Executes a command.
   * @param command The command to execute.
   */
  execute(command: TCommand, job: Job): Promise<TResult>;
}
