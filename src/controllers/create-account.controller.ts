import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { BigQueryService } from "src/bigquery/bigquery.service";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";

const createAccountBodySchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })
  .required();

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private bigquery: BigQueryService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.bigquery.user.select({
      where: { email },
    });

    if (userWithSameEmail.length > 0)
      throw new ConflictException("Já existe um usuário com esse e-mail");

    const hashedPassword = await hash(password, 10);

    await this.bigquery.user.create([
      {
        name,
        email,
        password: hashedPassword,
      },
    ]);
  }
}
