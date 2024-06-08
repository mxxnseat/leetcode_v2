import { CommandHandler } from '@lib/modules/cqrs/decorators';
import { JudgeCommand } from '../impl';
import { WorkerHost } from '@lib/modules/cqrs/command-handler';
import { ProblemService } from '@domain/problem/services';
import { exec } from 'child_process';
import { JudgeService } from '@domain/judge/services';
import { ExecutionResult } from '@domain/judge/interfaces';

@CommandHandler(JudgeCommand)
export class JudgeHandler extends WorkerHost<JudgeCommand> {
  constructor(
    private readonly judgeService: JudgeService,
    private readonly problemService: ProblemService,
  ) {
    super();
  }

  public async execute(command: JudgeCommand): Promise<any> {
    const problem = await this.problemService.retrieve(command.judge.problem);
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
          -e INPUT="${problem.inputs}" \
          -e USER_ALGORITHM="${command.judge.algorithm}" \
          leetcode_v2_node_v20
          `,
        (error, stdout, stderr) => {
          resolve({ error, stdout, stderr });
        },
      );
    });
    const matchResult = stdout.match(/{"execution_result":\s*(.*)}/);
    if (!matchResult) {
      return this.judgeService.update(command.judge.id, {
        success: false,
        failed_reason: 'Cannot find result',
      });
    }
    if (error || stderr) {
      return this.judgeService.update(command.judge.id, {
        success: false,
        failed_reason: error || stderr,
      });
    }
    const result = JSON.parse(matchResult[1]) as ExecutionResult[];
    const isNotValid = result.some(({ isCorrect }) => !isCorrect);
    if (isNotValid) {
      return this.judgeService.update(command.judge.id, {
        success: false,
        failed_reason: JSON.stringify(result),
      });
    }
    return this.judgeService.update(command.judge.id, {
      success: true,
    });
  }
}
