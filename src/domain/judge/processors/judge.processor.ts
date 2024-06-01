import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { exec } from 'child_process';
import { Job } from 'bullmq';
import { JUDGING_QUEUE_NAME } from '../constants';
import { JudgePayload } from '../interfaces/judge.interface';
import { EventBus } from '@nestjs/cqrs';
import { JudgeSuccededEvent } from '../events/judge-succeded.event';
import { ProblemService } from '@domain/problem/services';
import { JudgeFailedEvent } from '../events';

@Processor(JUDGING_QUEUE_NAME)
export class JudgeProcessor extends WorkerHost {
  constructor(
    private readonly eventBus: EventBus,
    private readonly problemService: ProblemService,
  ) {
    super();
  }

  public async process(job: Job<JudgePayload>): Promise<any> {
    const problem = await this.problemService.retrieve(job.data.problem_id);
    console.log({ problem });
    if (!problem) {
      return;
    }
    const input = job.data.test_run ? job.data.input : problem.input;
    const { stderr, stdout, error } = await new Promise<{
      error: unknown;
      stdout: string;
      stderr: any;
    }>((resolve) => {
      exec(
        `docker run --rm \
          -e PROBLEM_ALGORITHM="${problem.algorithm}" \
          -e INPUT="${input}" \
          -e USER_ALGORITHM="${job.data.code}" \
          leetcode_v2_node_v20
          `,
        (error, stdout, stderr) => {
          resolve({ error, stdout, stderr });
        },
      );
    });
    const [, result] = stdout.match(/{"execution_result":\s*(.*)}/);
    if (error || stderr) {
      return this.eventBus.publish(new JudgeFailedEvent(error || stderr));
    }
    this.eventBus.publish(new JudgeSuccededEvent({ result }));
  }

  @OnWorkerEvent('completed')
  public onCompleted() {
    console.log('done!');
  }

  @OnWorkerEvent('error')
  public onError(reason: unknown) {
    this.eventBus.publish(new JudgeFailedEvent(reason));
  }
}
