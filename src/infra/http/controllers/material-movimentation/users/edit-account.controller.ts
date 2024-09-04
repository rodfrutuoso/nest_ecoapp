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
import { ApiProperty, ApiTags } from "@nestjs/swagger";

const editAccountBodySchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  baseId: z.string().uuid().optional(),
  contractId: z.string().uuid().optional(),
  password: z.string().optional(),
});

class EditAccountBodySchema {
  @ApiProperty({
    example: "ativo/inativo",
    description: "status of user, if is active or not",
    required: false,
  })
  status!: string;
  @ApiProperty({
    example: "Administrator/Storkeeper/Estimator",
    description: "establish the type of access of the user",
    required: false,
  })
  type!: string;
  @ApiProperty({
    example: "base-id",
    description:
      "base's id that a storekeeper que interect. undefined if the user is not a storekeeper",
    required: false,
  })
  baseId!: string;
  @ApiProperty({
    example: "contract-id",
    description:
      "contract's id that a estimator que interect. undefined if the user is not a estimator",
    required: false,
  })
  contractId!: string;
  @ApiProperty({
    example: "password123",
    description: "user's password",
    required: false,
  })
  password!: string;
}

@ApiTags("user")
@Controller("/accounts/:id")
export class EditAccountController {
  constructor(private editStorekeeper: EditStorekeeperUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editAccountBodySchema))
    body: EditAccountBodySchema,
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
