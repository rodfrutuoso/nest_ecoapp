import { BadRequestException, ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { RegisterBaseUseCase } from "src/domain/material-movimentation/application/use-cases/contract-base/register-base";
import { ResourceAlreadyRegisteredError } from "src/domain/material-movimentation/application/use-cases/errors/resource-already-registered-error";

const registerBaseBodySchema = z
  .object({
    baseName: z.string(),
    contractId: z.string().uuid(),
  })
  .required();

type RegisterBaseBodySchema = z.infer<typeof registerBaseBodySchema>;

@Controller("/bases")
export class RegisterBaseController {
  constructor(private registerBase: RegisterBaseUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(registerBaseBodySchema))
    body: RegisterBaseBodySchema
  ) {
    const { baseName, contractId } = body;

    const result = await this.registerBase.execute({
      baseName,
      contractId
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
