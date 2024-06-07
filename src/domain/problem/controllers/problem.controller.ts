import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProblemService } from '../services';
import { AuthProtected, CurrentUser, Scopes } from '@domain/auth/decorators';
import { User } from '@domain/user/interfaces';
import { scopes } from '@config/scopes.config';
import { List } from '@lib/modules/database/interfaces';
import { NotFoundException } from '@lib/exception';
import {
  Problem,
  createProblemBodyDto,
  problemDto,
  updateProblemBodyDto,
} from '../schemas';
import { Schemas } from '@lib/modules/core/decorators/schemas.decorator';
import { listResponseSchema } from '@lib/modules/core/schemas';

@Controller('problems')
@AuthProtected()
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Get()
  @Scopes([scopes.problem.list])
  @Schemas({
    response: listResponseSchema(problemDto),
  })
  public async list(@Query() options): Promise<List<Problem>> {
    return this.problemService.list(options);
  }

  @Post()
  @Scopes([scopes.problem.create])
  @Schemas({ body: createProblemBodyDto, response: problemDto })
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
  @Schemas({
    response: problemDto,
  })
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
  @Schemas({
    body: updateProblemBodyDto,
    response: problemDto,
  })
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
  @HttpCode(204)
  public async delete(@Param('id_problem') idProblem: string): Promise<void> {
    const problem = await this.problemService.delete(idProblem);
    if (!problem) {
      throw new NotFoundException();
    }
  }
}
