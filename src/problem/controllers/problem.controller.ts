import { Body, Controller, Post } from '@nestjs/common';
import { Problem } from '../interfaces';
import { ProblemService } from '../services';

@Controller('problems')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  public async create(@Body() payload: Problem): Promise<void> {
    this.problemService.create(payload);
  }
}
