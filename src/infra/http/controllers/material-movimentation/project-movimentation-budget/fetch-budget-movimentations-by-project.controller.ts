import { BadRequestException, Get, NotFoundException } from "@nestjs/common";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { FetchBudgetMovimentationByProjectUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-budget-movimentations-by-project";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { MovimentationWithDetailsPresenter } from "src/infra/http/presenters/movimentation-with-details-presenter";
import { BudgetWithDetailsPresenter } from "src/infra/http/presenters/budget-with-details";

const fetchBudgetMovimentationByProjectBodySchema = z
  .object({
    project_number: z.string(),
  })
  .required();

type FetchBudgetMovimentationByProjectBodySchema = z.infer<
  typeof fetchBudgetMovimentationByProjectBodySchema
>;

@Controller("/movimentations/budgets")
export class FetchBudgetMovimentationByProjectController {
  constructor(
    private fetchBudgetMovimentationByProjectUseCase: FetchBudgetMovimentationByProjectUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Body(new ZodValidationPipe(fetchBudgetMovimentationByProjectBodySchema))
    body: FetchBudgetMovimentationByProjectBodySchema
  ) {
    const { project_number } = body;

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
