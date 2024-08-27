import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { FetchMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/fetch-material";
import { MaterialPresenter } from "../../../presenters/material-presenter";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { ApiProperty } from "@nestjs/swagger";

const fetchMaterialQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1)),
  type: z.string().optional(),
  contractId: z.string().uuid(),
});

class FetchMaterialQuerySchema {
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
  type!: string;
  @ApiProperty({
    example: "cotnract-id",
    description: "cotnract's id of the material",
  })
  contractId!: string;
}

@Controller("/materials")
export class FetchMaterialController {
  constructor(private fetchMaterialUseCase: FetchMaterialUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidationPipe(fetchMaterialQuerySchema))
    query: FetchMaterialQuerySchema
  ) {
    const { page, type, contractId } = query;

    const result = await this.fetchMaterialUseCase.execute({
      contractId,
      page,
      type,
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

    const materials = result.value.materials;

    return { materials: materials.map(MaterialPresenter.toHTTP) };
  }
}
