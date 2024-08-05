import {
  BadRequestException,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { EditStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/edit-storekeeper";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { NotAllowedError } from "src/domain/material-movimentation/application/use-cases/errors/not-allowed-error";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";

const editAccountBodySchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  baseId: z.string().uuid().optional(),
  contractId: z.string().uuid().optional(),
});

type EditAccountBodySchema = z.infer<typeof editAccountBodySchema>;

@Controller("/accounts/:id")
export class EditAccountController {
  constructor(private editStorekeeper: EditStorekeeperUseCase) {}

  @Put()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(editAccountBodySchema))
  async handle(
    @Body() body: EditAccountBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") userId: string
  ) {
    const { status, type, baseId, contractId } = body;

    const result = await this.editStorekeeper.execute({
      storekeeperId: userId,
      authorId: user.sub,
      type,
      baseId,
      status,
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
  }
}
