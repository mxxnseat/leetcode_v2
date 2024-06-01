import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Problem } from '../interfaces';
import { ProblemService } from '../services';

@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  public async create(@Body() payload: Problem): Promise<Problem> {
    const problem = await this.problemService.create(payload);
    return problem;
  }

  @Patch(':id_problem')
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
}
