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
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { CurrentUser } from "src/infra/auth/current-user.decorator";

const fetchMovimentationHistoryBodySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1)),
  baseId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  project_number: z.string().optional(),
  material_code: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(z.number().min(1).optional()),
  startDate: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value) : undefined)),
});

class FetchMovimentationHistoryQueryDto {
  @ApiProperty({
    example: "1",
    description: "Page number for pagination",
    required: false,
    default: 1,
    minimum: 1,
  })
  page!: number;
  @ApiProperty({
    example: "storekeeper@ecoeletrica.com.br",
    description: "user's email that made the movimentation",
    required: false,
  })
  email!: string;
  @ApiProperty({
    example: "id-da-base-para-pesquisar",
    description: "base's id that the movimentation was made",
    required: false,
  })
  baseId!: string;
  @ApiProperty({
    example: "B-1234567",
    description: "project's number that was movimetated",
    required: false,
  })
  project_number!: string;
  @ApiProperty({
    example: 123456,
    description: "material's code that was movimetated",
    required: false,
    minimum: 1,
  })
  material_code!: number;
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

@ApiTags("movimentation")
@Controller("/movimentations")
export class FetchMovimentationHistoryController {
  constructor(
    private fetchMovimentationHistoryUseCase: FetchMovimentationHistoryUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidationPipe(fetchMovimentationHistoryBodySchema))
    query: FetchMovimentationHistoryQueryDto
  ) {
    const {
      baseId,
      page,
      project_number,
      email,
      endDate,
      material_code,
      startDate,
    } = query;

    let endDateAjusted;

    if (endDate) {
      endDateAjusted = new Date(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate() + 1
      );
    }

    const result = await this.fetchMovimentationHistoryUseCase.execute({
      page,
      baseId,
      email,
      project_number,
      material_code,
      startDate,
      endDate: endDateAjusted,
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
