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

const fetchAccountsBodySchema = z.object({
  baseId: z.string().uuid().optional(),
});

type FetchAccountsBodySchema = z.infer<typeof fetchAccountsBodySchema>;

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/accounts")
export class FetchAccountsController {
  constructor(private FetchStorekeeper: FetchStorekeeperUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Body(new ZodValidationPipe(fetchAccountsBodySchema))
    body: FetchAccountsBodySchema
  ) {
    const { baseId } = body;

    const result = await this.FetchStorekeeper.execute({
      page,
      baseId,
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
