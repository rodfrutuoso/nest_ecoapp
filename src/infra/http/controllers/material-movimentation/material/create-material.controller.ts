import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { CreateMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/create-material";
import { ResourceAlreadyRegisteredError } from "src/domain/material-movimentation/application/use-cases/errors/resource-already-registered-error";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";

const createMaterialBodySchema = z
  .object({
    code: z.number(),
    description: z.string(),
    type: z.string(),
    unit: z.string(),
    contractId: z.string().uuid(),
  })
  .required();

class CreateMaterialBodySchema {
  @ApiProperty({
    example: 123456,
    description: "material's code. Has to be number",
  })
  code!: number;
  @ApiProperty({
    example: "CABO 4CAA ALMU",
    description: "material's description",
  })
  description!: string;
  @ApiProperty({
    example: "FERRAGEM",
    description:
      "It's one of the following types: FERRAGEM/CONCRETO/EQUIPAMENTO",
  })
  type!: string;
  @ApiProperty({
    example: "CDA",
    description: "The unit of the material. Could be M, CDA, UN, KG etc",
  })
  unit!: string;
  @ApiProperty({
    example: "contract-id",
    description: "contract's id of the material",
  })
  contractId!: string;
}

@ApiTags("material")
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
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    return { message: "criação realizada" }
  }
}
