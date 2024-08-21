import {
    BadRequestException,
    Get,
    NotFoundException,
  } from "@nestjs/common";
  import { Body, Controller, HttpCode } from "@nestjs/common";
  import { z } from "zod";
  import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
  import { FetchBudgetByProjectNameUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-budget-by-project-name";
  import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
  import { BudgetPresenter } from "src/infra/http/presenters/budget-presenter";
  
  const fetchBudgetByProjectNameBodySchema = z.object({
    project_number: z.string(),
  }).required()
  
  type FetchBudgetByProjectNameBodySchema = z.infer<
    typeof fetchBudgetByProjectNameBodySchema
  >;
  
  @Controller("/budgets")
  export class FetchBudgetByProjectNameController {
    constructor(
      private fetchBudgetByProjectNameUseCase: FetchBudgetByProjectNameUseCase
    ) {}
  
    @Get()
    @HttpCode(200)
    async handle(
      @Body(new ZodValidationPipe(fetchBudgetByProjectNameBodySchema))
      body: FetchBudgetByProjectNameBodySchema
    ) {
      const { project_number } = body;
  
      const result = await this.fetchBudgetByProjectNameUseCase.execute({
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
  
      const budgets = result.value.budgets;
  
      return {
        budgets: budgets.map(BudgetPresenter.toHTTP),
      };
    }
  }
  