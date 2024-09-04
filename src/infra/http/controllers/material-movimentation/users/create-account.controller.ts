import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { RegisterStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/register-storekeeper";
import { ResourceAlreadyRegisteredError } from "src/domain/material-movimentation/application/use-cases/errors/resource-already-registered-error";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  cpf: z.string().regex(/^\d{11,}$/, "O CPF precisa ter 11 dígitos"),
  type: z.string(),
  baseId: z.string().uuid(),
  contractId: z.string().uuid().optional(),
});

class CreateAccountBodySchema {
  @ApiProperty({
    example: "João da Silva",
    description: "user's name",
  })
  name!: string;
  @ApiProperty({
    example: "joaosilva@ecoeletrica.com.br",
    description: "user's email in Ecoelétrica's domain",
  })
  email!: string;
  @ApiProperty({
    example: "12345678912",
    description: "user's CPF, just number with the zeros",
  })
  cpf!: string;
  @ApiProperty({
    example: "Administrator/Storkeeper/Estimator",
    description: "establish the type of access of the user",
  })
  type!: string;
  @ApiProperty({
    example: "base-id",
    description:
      "base's id that a storekeeper que interect. undefined if the user is not a storekeeper",
  })
  baseId!: string;
  @ApiProperty({
    example: "contract-id",
    description:
      "contract's id that a estimator que interect. undefined if the user is not a estimator",
    required: false,
  })
  contractId!: string;
  @ApiProperty({
    example: "password123",
    description: "user's password",
  })
  password!: string;
}

@ApiTags("user")
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

    return { message: "criação realizada" };
  }
}
