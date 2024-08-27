import {
  BadRequestException,
  Get,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { FetchMovimentationHistoryUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-movimentations-history";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { MovimentationWithDetailsPresenter } from "src/infra/http/presenters/movimentation-with-details-presenter";
import { ApiProperty } from "@nestjs/swagger";

const fetchMovimentationHistoryBodySchema = z.object({
  page: z.string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1)),
  userId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  materialId: z.string().uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export class FetchMovimentationHistoryQueryDto {
  @ApiProperty({
    example: "1",
    description: "Page number for pagination",
    required: false,
    default: 1,
    minimum: 1,
  })
  page!: number;
  @ApiProperty({
    example: "user-id",
    description: "user's id that made the movimentation",
    required: false,
  })
  userId!: string;
  @ApiProperty({
    example: "project-id",
    description: "project's id that was movimetated",
    required: false,
  })
  projectId!: string;
  @ApiProperty({
    example: "material-id",
    description: "material's id that was movimetated",
    required: false,
  })
  materialId!: string;
  @ApiProperty({
    example: "2024-03-31",
    description: "start date for search",
    required: false,
  })
  startDate!: Date;
  @ApiProperty({
    example: "2024-03-31",
    description: "end date for search",
    required: false,
  })
  endDate!: Date;
}

@Controller("/movimentations/:baseId")
export class FetchMovimentationHistoryController {
  constructor(
    private fetchMovimentationHistoryUseCase: FetchMovimentationHistoryUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param("baseId") baseId: string,
    @Query(new ZodValidationPipe(fetchMovimentationHistoryBodySchema))
    query: FetchMovimentationHistoryQueryDto
  ) {
    const { page, projectId, userId, endDate, materialId, startDate } = query;

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
      movimentations: movimentations.map(
        MovimentationWithDetailsPresenter.toHTTP
      ),
    };
  }
}
