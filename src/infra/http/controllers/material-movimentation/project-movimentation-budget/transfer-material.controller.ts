import { BadRequestException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { TransferMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/transfer-material";

const transferMaterialBodySchema = z.array(
  z
    .object({
      materialId: z.string().uuid(),
      projectId: z.string().uuid(),
      observation: z.string(),
      baseId: z.string().uuid(),
      value: z.number(),
    })
    .required()
);

type TransferMaterialBodySchema = z.infer<typeof transferMaterialBodySchema>;

@Controller("/movimentation")
export class TransferMaterialController {
  constructor(private transferMaterial: TransferMaterialUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(transferMaterialBodySchema))
    body: TransferMaterialBodySchema
  ) {
    const transferMaterialRequest: TransferMaterialBodySchema = body;

    const result = await this.transferMaterial.execute(
      transferMaterialRequest.map((item) => {
        return {
          storekeeperId: user.sub,
          materialId: item.materialId,
          projectId: item.projectId,
          observation: item.observation,
          baseId: item.baseId,
          value: item.value,
        };
      })
    );

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}