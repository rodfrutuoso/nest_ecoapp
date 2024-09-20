import {
  BadRequestException,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { GetStorekeeperByIdUseCase } from "src/domain/material-movimentation/application/use-cases/users/get-storekeeper-by-id";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { ApiTags } from "@nestjs/swagger";
import { GetStorekeeperByidDecorator } from "src/infra/http/swagger dto and decorators/material-movimentation/users/response decorators/get-account-by-id.decorator";
import { UserWithBaseContractPresenter } from "src/infra/http/presenters/user-with-base-contract-presenter";
import { GetEstimatorByIdUseCase } from "src/domain/material-movimentation/application/use-cases/users/get-estimator-by-id";

@ApiTags("user")
@Controller("/accounts/:id")
export class GetStorekeeperByidController {
  constructor(
    private getStorekeeperByidUseCase: GetStorekeeperByIdUseCase,
    private getEstimatorByidUseCase: GetEstimatorByIdUseCase
  ) {}

  @Get()
  @HttpCode(200)
  @GetStorekeeperByidDecorator()
  async handle(@Param("id") id: string) {
    const resultStorekeeper = await this.getStorekeeperByidUseCase.execute({
      storekeeperId: id,
    });

    let resultEstimator;

    if (resultStorekeeper.isLeft()) {
      resultEstimator = await this.getEstimatorByidUseCase.execute({
        estimatorId: id,
      });

      if (resultEstimator.isLeft()) {
        const error = resultEstimator.value;

        switch (error.constructor) {
          case ResourceNotFoundError:
            throw new NotFoundException(error.message);
          default:
            throw new BadRequestException();
        }
      }
    }

    const user =
      resultStorekeeper.value instanceof ResourceNotFoundError
        ? resultEstimator.value.estimator
        : resultStorekeeper.value.storekeeper;

    return { user: UserWithBaseContractPresenter.toHTTP(user) };
  }
}
