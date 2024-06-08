import { WorkerHost as NestWorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ICommandHandler } from './interfaces';
import { ICommand } from '@nestjs/cqrs';

export abstract class WorkerHost<TCommand extends ICommand = ICommand>
  extends NestWorkerHost
  implements ICommandHandler<TCommand>
{
  public async process(job: Job<TCommand, any, string>): Promise<any> {
    return this.execute(job.data, job);
  }
  public abstract execute(command: TCommand, job: Job): Promise<any>;
}
