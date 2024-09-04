import {
  BadRequestException,
  Delete,
  NotFoundException,
  Param,
  UnauthorizedException,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { DeleteStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/delete-storekeeper";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { ApiTags } from "@nestjs/swagger";
import { NotAllowedError } from "src/domain/material-movimentation/application/use-cases/errors/not-allowed-error";
import { EditAccountDecorator } from "src/infra/http/swagger dto and decorators/material-movimentation/users/response decorators/edit-account.decorator";

@ApiTags("user")
@Controller("/accounts/:id")
export class DeleteAccountController {
  constructor(private deleteStorekeeper: DeleteStorekeeperUseCase) {}

  @Delete()
  @HttpCode(201)
  @EditAccountDecorator()
  async handle(@CurrentUser() user: UserPayload, @Param("id") userId: string) {
    const result = await this.deleteStorekeeper.execute({
      storekeeperId: userId,
      authorId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException();
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    return { message: "exclusão realizada" };
  }
}
