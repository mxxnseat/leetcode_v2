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
  UseGuards,
} from '@nestjs/common';
import { ProblemService } from '../services';
import { AuthProtected, CurrentUser, Scopes } from '@domain/auth/decorators';
import { User } from '@domain/user/interfaces';
import { scopes as leetcodeScopes } from '@config/scopes.config';
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
import { UpdateProblemGuard } from '../guards';
import { CurrentScopes } from '@domain/auth/decorators/current-scopes.decorator';
import { ScopesService } from '@domain/auth/services';
import { LeetcodeMetadata, Metadata } from '@lib/metadata';

@Controller('problems')
@AuthProtected()
export class ProblemController {
  constructor(
    private readonly scopesService: ScopesService,
    private readonly problemService: ProblemService,
  ) {}

  @Get()
  @Scopes([leetcodeScopes.problem.list])
  @Schemas({
    response: listResponseSchema(problemDto),
  })
  public async list(
    @Query() options,
    @CurrentScopes() scopes: string[],
  ): Promise<List<Problem>> {
    if (
      this.scopesService.verify([leetcodeScopes.problem.listPendings], scopes)
    ) {
      return this.problemService.list(options);
    }
    return this.problemService.list({ ...options, status: 'approved' });
  }

  @Post()
  @Scopes([leetcodeScopes.problem.create])
  @Schemas({ body: createProblemBodyDto, response: problemDto })
  public async create(
    @Body() payload: Problem,
    @CurrentUser() user: User,
    @LeetcodeMetadata() metadata: Metadata,
  ): Promise<Problem> {
    return this.problemService.create(
      {
        ...payload,
        created_by: user.id,
      },
      metadata,
    );
  }

  @Get(':id_problem')
  @Scopes([leetcodeScopes.problem.retrieve])
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
  @UseGuards(UpdateProblemGuard)
  @Scopes([leetcodeScopes.problem.update])
  @Schemas({
    body: updateProblemBodyDto,
    response: problemDto,
  })
  public async update(
    @Param('id_problem') problemId: string,
    @Body() payload: Partial<Problem>,
    @LeetcodeMetadata() metadata: Metadata,
  ): Promise<Problem> {
    const updatedProblem = await this.problemService.update(
      problemId,
      payload,
      metadata,
    );
    if (!updatedProblem) {
      throw new NotFoundException();
    }
    return updatedProblem;
  }

  @Delete(':id_problem')
  @Scopes([leetcodeScopes.problem.delete])
  @HttpCode(204)
  public async delete(@Param('id_problem') idProblem: string): Promise<void> {
    const problem = await this.problemService.delete(idProblem);
    if (!problem) {
      throw new NotFoundException();
    }
  }
}
