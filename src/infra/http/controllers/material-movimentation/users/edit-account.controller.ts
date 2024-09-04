import {
  BadRequestException,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from "@nestjs/common";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { EditStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/edit-storekeeper";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { NotAllowedError } from "src/domain/material-movimentation/application/use-cases/errors/not-allowed-error";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { ApiTags } from "@nestjs/swagger";
import { EditAccountDecorator } from "src/infra/http/swagger dto and decorators/material-movimentation/users/response decorators/edit-account.decorator";
import { EditAccountBodyDto } from "src/infra/http/swagger dto and decorators/material-movimentation/users/dto classes/edit-account.dto";

const editAccountBodyDto = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  baseId: z.string().uuid().optional(),
  contractId: z.string().uuid().optional(),
  password: z.string().optional(),
});

@ApiTags("user")
@Controller("/accounts/:id")
export class EditAccountController {
  constructor(private editStorekeeper: EditStorekeeperUseCase) {}

  @Put()
  @HttpCode(201)
  @EditAccountDecorator()
  async handle(
    @Body(new ZodValidationPipe(editAccountBodyDto))
    body: EditAccountBodyDto,
    @CurrentUser() user: UserPayload,
    @Param("id") userId: string
  ) {
    const { password, status, type, baseId, contractId } = body;

    const result = await this.editStorekeeper.execute({
      storekeeperId: userId,
      authorId: user.sub,
      type,
      baseId,
      status,
      password,
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

    return { message: "edição realizada" };
  }
}
