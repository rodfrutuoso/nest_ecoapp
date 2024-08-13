import { BadRequestException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { TransferMovimentationBetweenProjectsUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/transfer-movimentation-between-projects";

const transferMovimentationBetweenProjectsBodySchema = z.array(
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

type TransferMovimentationBetweenProjectsBodySchema = z.infer<typeof transferMovimentationBetweenProjectsBodySchema>;

@Controller("/movimentation")
export class TransferMovimentationBetweenProjectsController {
  constructor(private transferMovimentationBetweenProjects: TransferMovimentationBetweenProjectsUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(transferMovimentationBetweenProjectsBodySchema))
    body: TransferMovimentationBetweenProjectsBodySchema
  ) {
    const transferMovimentationBetweenProjectsRequest: TransferMovimentationBetweenProjectsBodySchema = body;

    const result = await this.transferMovimentationBetweenProjects.execute(
      transferMovimentationBetweenProjectsRequest.map((item) => {
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
