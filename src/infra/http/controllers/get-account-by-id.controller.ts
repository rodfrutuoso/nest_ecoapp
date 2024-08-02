import {
  BadRequestException,
  Get,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { GetStorekeeperByIdUseCase } from "src/domain/material-movimentation/application/use-cases/users/get-storekeeper-by-id";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { UserPresenter } from "../presenters/user-presentar";

@Controller("/accounts/:id")
export class GetStorekeeperByidController {
  constructor(private getStorekeeperByidUseCase: GetStorekeeperByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param("id") id: string) {
    const result = await this.getStorekeeperByidUseCase.execute({
      storekeeperId: id,
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

    const user = result.value.storekeeper;

    return { user: UserPresenter.toHTTP(user) };
  }
}
