import { WorkerHost as NestWorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ICommandHandler } from './interfaces';
import { Command, ICommand } from './command';
import { Logger } from '@nestjs/common';

export abstract class WorkerHost<TCommand extends ICommand = ICommand>
  extends NestWorkerHost
  implements ICommandHandler<TCommand>
{
  private readonly logger = new Logger(this.constructor.name);

  public async process(job: Job<any, any, string>): Promise<any> {
    const command = Command.deserialize(job.data) as TCommand;
    this.logger.log(
      {
        traceId: command.metadata.traceId,
        command: {
          name: command.name,
        },
      },
      `Command execution`,
    );
    try {
      const result = await this.execute(command, job);
      this.logger.log(
        {
          traceId: command.metadata.traceId,
          command: {
            name: (command as unknown as { name: string }).name,
          },
        },
        `Command finished`,
      );
      return result;
    } catch (err) {
      this.logger.log(
        {
          traceId: command.metadata.traceId,
          command: {
            name: (command as unknown as { name: string }).name,
            error: err.message,
          },
        },
        `Command failed`,
      );
    }
  }
  public abstract execute(command: TCommand, job: Job): Promise<any>;
}
