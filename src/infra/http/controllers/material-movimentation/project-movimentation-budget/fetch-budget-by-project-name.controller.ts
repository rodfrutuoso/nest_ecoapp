import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { FetchBudgetByProjectNameUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-budget-by-project-name";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { BudgetWithDetailsPresenter } from "src/infra/http/presenters/budget-with-details";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { CurrentUser } from "src/infra/auth/current-user.decorator";

const fetchBudgetByProjectNameBodySchema = z
  .object({
    project_number: z.string(),
  })
  .required();

class FetchBudgetByProjectNameQuerySchema {
  @ApiProperty({
    example: "B-1234567",
    description: "project identification number",
  })
  project_number!: string;
}

@ApiTags("budgets")
@Controller("/budgets")
export class FetchBudgetByProjectNameController {
  constructor(
    private fetchBudgetByProjectNameUseCase: FetchBudgetByProjectNameUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(fetchBudgetByProjectNameBodySchema))
    query: FetchBudgetByProjectNameQuerySchema
  ) {
    const { project_number } = query;

    const result = await this.fetchBudgetByProjectNameUseCase.execute({
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

    const budgets = result.value.budgets;

    return {
      budgets: budgets.map(BudgetWithDetailsPresenter.toHTTP),
    };
  }
}
