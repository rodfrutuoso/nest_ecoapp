import { BadRequestException, ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { CreateMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/create-material";
import { ResourceAlreadyRegisteredError } from "src/domain/material-movimentation/application/use-cases/errors/resource-already-registered-error";

const createMaterialBodySchema = z
  .object({
    code: z.number(),
    description: z.string(),
    type: z.string(),
    unit: z.string(),
    contractId: z.string().uuid(),
  })
  .required();

type CreateMaterialBodySchema = z.infer<typeof createMaterialBodySchema>;

@Controller("/materials")
export class CreateMaterialController {
  constructor(private createMaterial: CreateMaterialUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createMaterialBodySchema))
    body: CreateMaterialBodySchema
  ) {
    const { code, description, type, unit, contractId } = body;

    const result = await this.createMaterial.execute({
      code,
      description,
      type,
      unit,
      contractId,
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
