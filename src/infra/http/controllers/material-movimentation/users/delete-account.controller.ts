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
import { VerifyAuthorTypeUseCase } from "src/domain/material-movimentation/application/use-cases/users/verify-author-type";
import { DeleteEstimatorUseCase } from "src/domain/material-movimentation/application/use-cases/users/delete-estimator";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";

@ApiTags("user")
@Controller("/accounts/:id")
export class DeleteAccountController {
  constructor(
    private deleteStorekeeper: DeleteStorekeeperUseCase,
    private deleteEstimator: DeleteEstimatorUseCase,
    private verifyAuthorType: VerifyAuthorTypeUseCase
  ) {}

  @Delete()
  @HttpCode(201)
  @EditAccountDecorator()
  async handle(@CurrentUser() user: UserPayload, @Param("id") userId: string) {
    let result;
    const resultVerify = await this.verifyAuthorType.execute({
      authorId: user.sub,
      userId,
    });

    if (resultVerify.isLeft()) {
      const error = resultVerify.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException();
        default:
          throw new BadRequestException();
      }
    }

    if (resultVerify.value.user instanceof Storekeeper)
      result = await this.deleteStorekeeper.execute({
        storekeeperId: resultVerify.value.user.id.toString(),
        authorType: resultVerify.value.author.type,
      });
    else
      result = await this.deleteEstimator.execute({
        estimatorId: resultVerify.value.user.id.toString(),
        authorType: resultVerify.value.author.type,
      });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException();
        case ResourceNotFoundError:
          throw new NotFoundException();
        default:
          throw new BadRequestException();
      }
    }

    return { message: "exclusão realizada" };
  }
}
