import { BadRequestException, ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { RegisterContractUseCase } from "src/domain/material-movimentation/application/use-cases/contract-base/register-contract";
import { ResourceAlreadyRegisteredError } from "src/domain/material-movimentation/application/use-cases/errors/resource-already-registered-error";

const registerContractBodySchema = z
  .object({
    contractName: z.string(),
  })
  .required();

type RegisterContractBodySchema = z.infer<typeof registerContractBodySchema>;

@Controller("/contracts")
export class RegisterContractController {
  constructor(private registerContract: RegisterContractUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(registerContractBodySchema))
    body: RegisterContractBodySchema
  ) {
    const { contractName } = body;

    const result = await this.registerContract.execute({
      contractName,
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
