import {
  BadRequestException,
  ConflictException,
  Delete,
  Param,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { ResourceAlreadyRegisteredError } from "src/domain/material-movimentation/application/use-cases/errors/resource-already-registered-error";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { DeleteStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/delete-storekeeper";

@Controller("/accounts/:id")
export class DeleteAccountController {
  constructor(private deleteStorekeeper: DeleteStorekeeperUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param("id") userId: string) {
    const result = await this.deleteStorekeeper.execute({
      storekeeperId: userId,
      authorId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceAlreadyRegisteredError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
