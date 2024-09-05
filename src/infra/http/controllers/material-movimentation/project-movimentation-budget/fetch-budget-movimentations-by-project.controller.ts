import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { FetchBudgetMovimentationByProjectUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-budget-movimentations-by-project";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { MovimentationWithDetailsPresenter } from "src/infra/http/presenters/movimentation-with-details-presenter";
import { BudgetWithDetailsPresenter } from "src/infra/http/presenters/budget-with-details";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { FetchBudgetMovimentationByProjectDecorator } from "src/infra/http/swagger dto and decorators/material-movimentation/project-movimentation-budget/response decorators/fetch-budget-movimentations-by-project.decorator";
import { FetchBudgetMovimentationByProjectQueryDto } from "src/infra/http/swagger dto and decorators/material-movimentation/project-movimentation-budget/dto classes/fetch-budget-movimentations-by-project.dto";

const fetchBudgetMovimentationByProjectQuerySchema = z.object({
  project_number: z.string(),
});

@ApiTags("movimentation")
@Controller("/movimentations-budgets")
export class FetchBudgetMovimentationByProjectController {
  constructor(
    private fetchBudgetMovimentationByProjectUseCase: FetchBudgetMovimentationByProjectUseCase
  ) {}

  @Get()
  @HttpCode(200)
  @FetchBudgetMovimentationByProjectDecorator()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(fetchBudgetMovimentationByProjectQuerySchema))
    query: FetchBudgetMovimentationByProjectQueryDto
  ) {
    const { project_number } = query;

    const result = await this.fetchBudgetMovimentationByProjectUseCase.execute({
      project_number,
      baseId: user.baseId ?? "",
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
