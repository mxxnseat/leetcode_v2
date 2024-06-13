import { WorkerHost as NestWorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ICommandHandler } from './interfaces';
import { Command, ICommand } from './command';

export abstract class WorkerHost<TCommand extends ICommand = ICommand>
  extends NestWorkerHost
  implements ICommandHandler<TCommand>
{
  public async process(job: Job<any, any, string>): Promise<any> {
    return this.execute(Command.deserialize(job.data) as TCommand, job);
  }
  public abstract execute(command: TCommand, job: Job): Promise<any>;
}
