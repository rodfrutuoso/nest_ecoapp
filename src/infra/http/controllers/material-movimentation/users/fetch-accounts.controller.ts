import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { FetchStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/fetch-storekeeper";
import { UserWithBaseContractPresenter } from "src/infra/http/presenters/user-with-base-contract-presenter";
import { ApiTags } from "@nestjs/swagger";
import { FetchAccountsQueryDto } from "src/infra/http/swagger dto and decorators/material-movimentation/users/dto classes/fetch-accounts.dto";
import { FetchAccountsDecorator } from "src/infra/http/swagger dto and decorators/material-movimentation/users/response decorators/fetch-accounts.decorator";

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

@ApiTags("user")
@Controller("/accounts")
export class FetchAccountsController {
  constructor(private FetchStorekeeper: FetchStorekeeperUseCase) {}

  @Get()
  @HttpCode(200)
  @FetchAccountsDecorator()
  async handle(
    @Query(new ZodValidationPipe(fetchAccountsBodySchema))
    query: FetchAccountsQueryDto
  ) {
    const { page, baseId, name } = query;

    const result = await this.FetchStorekeeper.execute({
      page,
      baseId,
      name,
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
