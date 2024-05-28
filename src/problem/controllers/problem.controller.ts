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
  public async create(@Body() payload: Problem): Promise<void> {
    this.problemService.create(payload);
  }

  @Patch(':id_problem')
  public update(
    @Param('id_problem') problemId: number,
    @Body() payload: Partial<Problem>,
  ): Problem {
    const updatedProblem = this.problemService.update(problemId, payload);
    if (!updatedProblem) {
      throw new NotFoundException();
    }
    return updatedProblem;
  }
}
