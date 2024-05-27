import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { exec } from 'child_process';
import { Job } from 'bullmq';
import { JUDGING_QUEUE_NAME } from '../constants';
import { JudgePayload } from '../interfaces/judge.interface';
import { EventBus } from '@nestjs/cqrs';
import { JudgeEvent } from '../events/judge.event';
import { ProblemService } from 'src/problem/services';
import { error } from 'console';

@Processor(JUDGING_QUEUE_NAME)
export class JudgeProcessor extends WorkerHost {
  constructor(
    private readonly eventBus: EventBus,
    private readonly problemService: ProblemService,
  ) {
    super();
  }

  public async process(job: Job<JudgePayload>): Promise<any> {
    const problem = this.problemService.retrieve(job.data.problem_id);
    console.log({ problem });
    if (!problem) {
      return;
    }
    const { stderr, stdout, error } = await new Promise<{
      error: unknown;
      stdout: string;
      stderr: any;
    }>((resolve) => {
      exec(
        `docker run --rm \
          -e PROBLEM_ALGORITHM="${problem.algorithm}" \
          -e INPUT="${job.data.input}" \
          -e EXECUTABLE="${job.data.code}" \
          leetcode_v2_node_v20
          `,
        (error, stdout, stderr) => {
          resolve({ error, stdout, stderr });
        },
      );
    });
    console.log({ stdout });
    const res = stdout.match(/{"execution_result":\s*(.*)}/);
    console.log('execution result', {
      executionResult: res,
      error,
      stdout,
      stderr,
    });
    this.eventBus.publish(new JudgeEvent({ result: res }));
  }

  @OnWorkerEvent('completed')
  public onCompleted() {
    console.log('done!');
  }

  @OnWorkerEvent('error')
  public onError(reason: unknown) {
    console.log(reason);
  }
}
