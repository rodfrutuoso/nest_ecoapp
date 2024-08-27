import {
  BadRequestException,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { FetchBudgetMovimentationByProjectUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-budget-movimentations-by-project";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { MovimentationWithDetailsPresenter } from "src/infra/http/presenters/movimentation-with-details-presenter";
import { BudgetWithDetailsPresenter } from "src/infra/http/presenters/budget-with-details";
import { ApiProperty } from "@nestjs/swagger";

const fetchBudgetMovimentationByProjectBodySchema = z
  .object({
    project_number: z.string(),
  })
  .required();

export class FetchBudgetMovimentationByProjectQueryDto {
  @ApiProperty({
    example: "B-1234567",
    description: "project identification number",
  })
  project_number!: string;
}

@Controller("/movimentations/budgets/:project_number")
export class FetchBudgetMovimentationByProjectController {
  constructor(
    private fetchBudgetMovimentationByProjectUseCase: FetchBudgetMovimentationByProjectUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@Param("project_number") project_number: string) {
    const result = await this.fetchBudgetMovimentationByProjectUseCase.execute({
      project_number,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const movimentations = result.value.movimentations;
    const budgets = result.value.budgets;

    return {
      movimentations: movimentations.map(
        MovimentationWithDetailsPresenter.toHTTP
      ),
      budgets: budgets.map(BudgetWithDetailsPresenter.toHTTP),
    };
  }
}
