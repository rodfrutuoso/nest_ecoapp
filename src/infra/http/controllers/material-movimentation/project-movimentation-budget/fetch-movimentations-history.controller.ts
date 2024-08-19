import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { FetchMovimentationHistoryUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-movimentations-history";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { MovimentationPresenter } from "src/infra/http/presenters/movimentation-presenter";

const fetchMovimentationHistoryBodySchema = z.object({
  baseId: z.string(),
  userId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  materialId: z.string().uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type FetchMovimentationHistoryBodySchema = z.infer<
  typeof fetchMovimentationHistoryBodySchema
>;

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/movimentations")
export class FetchMovimentationHistoryController {
  constructor(
    private fetchMovimentationHistoryUseCase: FetchMovimentationHistoryUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Body(new ZodValidationPipe(fetchMovimentationHistoryBodySchema))
    body: FetchMovimentationHistoryBodySchema
  ) {
    const { baseId, projectId, userId, endDate, materialId, startDate } = body;

    const result = await this.fetchMovimentationHistoryUseCase.execute({
      page,
      baseId,
      storekeeperId: userId,
      projectId,
      materialId,
      startDate,
      endDate,
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

    return {
      movimentations: movimentations.map(MovimentationPresenter.toHTTP),
    };
  }
}
