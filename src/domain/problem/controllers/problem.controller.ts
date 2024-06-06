import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Problem } from '../interfaces';
import { ProblemService } from '../services';
import { AuthProtected, CurrentUser, Scopes } from '@domain/auth/decorators';
import { User } from '@domain/user/interfaces';
import { scopes } from '@config/scopes.config';
import { List } from '@lib/modules/database/interfaces';
import { NotFoundException } from '@lib/exception';

@Controller('problems')
@AuthProtected()
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get()
  @Scopes([scopes.problem.list])
  public async list(@Query() options): Promise<List<Problem>> {
    return this.problemService.list(options);
  }

  @Post()
  @Scopes([scopes.problem.create])
  public async create(
    @Body() payload: Problem,
    @CurrentUser() user: User,
    r,
  ): Promise<Problem> {
    const problem = await this.problemService.create({
      ...payload,
      created_by: user.id,
    });
    return problem;
  }

  @Get(':id_problem')
  @Scopes([scopes.problem.retrieve])
  public async retrieve(
    @Param('id_problem') idProblem: string,
  ): Promise<Problem> {
    const problem = await this.problemService.retrieve(idProblem);
    if (!problem) {
      throw new NotFoundException();
    }
    return problem;
  }

  @Patch(':id_problem')
  @Scopes([scopes.problem.update])
  public async update(
    @Param('id_problem') problemId: string,
    @Body() payload: Partial<Problem>,
  ): Promise<Problem> {
    const updatedProblem = await this.problemService.update(problemId, payload);
    if (!updatedProblem) {
      throw new NotFoundException();
    }
    return updatedProblem;
  }

  @Delete(':id_problem')
  @Scopes([scopes.problem.delete])
  public async delete(
    @Param('id_problem') idProblem: string,
  ): Promise<Problem> {
    const problem = await this.problemService.delete(idProblem);
    if (!problem) {
      throw new NotFoundException();
    }
    return problem;
  }
}
