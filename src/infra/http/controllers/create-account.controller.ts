import { UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { RegisterStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/register-storekeeper";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  cpf: z.string().regex(/^\d{11,}$/, "O CPF precisa ter 11 dígitos"),
  type: z.string(),
  baseId: z.string(),
  contractId: z.string().optional(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private registerStorekeeper: RegisterStorekeeperUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, cpf, type, baseId, contractId } = body;

    const result = await this.registerStorekeeper.execute({
      name,
      email,
      password,
      cpf,
      type,
      baseId,
    });

    if (result.isLeft()) throw new Error();
  }
}
