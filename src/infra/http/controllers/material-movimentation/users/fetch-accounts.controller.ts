import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { FetchStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/fetch-storekeeper";
import { UserWithBaseContractPresenter } from "src/infra/http/presenters/user-with-base-contract-presenter";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

const fetchAccountsBodySchema = z.object({
  page: z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1)),
  baseId: z.string().uuid().optional(),
  name: z.string().optional(),
});

class FetchAccountsQueryDto {
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
    description: "user's id",
    required: false,
  })
  baseId!: string;
  @ApiProperty({
    example: "João da Silva",
    description: "name, or part of it, of the searched user",
    required: false,
  })
  name!: string;
}

@ApiTags("users")
@Controller("/accounts")
export class FetchAccountsController {
  constructor(private FetchStorekeeper: FetchStorekeeperUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidationPipe(fetchAccountsBodySchema))
    query: FetchAccountsQueryDto
  ) {
    const { page, baseId, name } = query;

    const result = await this.FetchStorekeeper.execute({
      page,
      baseId,
      name
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

    const users = result.value.storekeepers;

    return { users: users.map(UserWithBaseContractPresenter.toHTTP) };
  }
}
