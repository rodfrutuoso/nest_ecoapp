import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { CurrentUser } from "src/infra/auth/current-user.decorator";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { TransferMovimentationBetweenProjectsUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/transfer-movimentation-between-projects";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";

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

type TransferMovimentationBetweenProjectsBodySchema = z.infer<
  typeof transferMovimentationBetweenProjectsBodySchema
>;

@Controller("/transfer-movimentation")
export class TransferMovimentationBetweenProjectsController {
  constructor(
    private transferMovimentationBetweenProjects: TransferMovimentationBetweenProjectsUseCase
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(transferMovimentationBetweenProjectsBodySchema))
    body: TransferMovimentationBetweenProjectsBodySchema
  ) {
    const transferMovimentationBetweenProjectsRequest: TransferMovimentationBetweenProjectsBodySchema =
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
  }
}
