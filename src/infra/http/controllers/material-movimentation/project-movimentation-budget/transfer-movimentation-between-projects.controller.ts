import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { TransferMovimentationBetweenProjectsUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/transfer-movimentation-between-projects";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger";

const transferMovimentationBetweenProjectsBodySchema = z.array(
  z
    .object({
      materialId: z.string().uuid(),
      projectIdOut: z.string().uuid(),
      projectIdIn: z.string().uuid(),
      observation: z.string(),
      baseId: z.string().uuid(),
      value: z.number(),
    })
    .required()
);

// for swagger
class TransferMovimentationBetweenProjectsBodySchemaDto {
  @ApiProperty({
    example: "material-id",
    description: "material's ID to be transfer",
  })
  materialId!: string;
  @ApiProperty({
    example: "project-out-id",
    description: "project's ID that the material will be output from",
  })
  projectIdOut!: string;
  @ApiProperty({
    example: "project-in-id",
    description: "project's ID that the material will go into",
  })
  projectIdIn!: string;
  @ApiProperty({
    example: "o material estava com a embalagem rasgada",
    description: "observation of the transfer of that material",
  })
  observation!: string;
  @ApiProperty({
    example: "base-id",
    description: "base's ID of the storekeeper",
  })
  baseId!: string;
  @ApiProperty({
    example: 3,
    description: "value to be transfer",
  })
  value!: number;
}

@ApiTags("movimentation")
@Controller("/transfer-movimentation")
export class TransferMovimentationBetweenProjectsController {
  constructor(
    private transferMovimentationBetweenProjects: TransferMovimentationBetweenProjectsUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @ApiBody({
    type: TransferMovimentationBetweenProjectsBodySchemaDto,
    isArray: true,
  }) // for swagger
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(transferMovimentationBetweenProjectsBodySchema))
    body: TransferMovimentationBetweenProjectsBodySchemaDto[]
  ) {
    const transferMovimentationBetweenProjectsRequest: TransferMovimentationBetweenProjectsBodySchemaDto[] =
      body;

    const result = await this.transferMovimentationBetweenProjects.execute(
      transferMovimentationBetweenProjectsRequest.map((item) => {
        return {
          storekeeperId: user.sub,
          materialId: item.materialId,
          projectIdOut: item.projectIdOut,
          projectIdIn: item.projectIdIn,
          observation: item.observation,
          baseId: item.baseId,
          value: item.value,
        };
      })
    );

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    return { message: "criação realizada" }
  }
}
