import { ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { BigQueryService } from "src/bigquery/bigquery.service";
import { UserProps } from "src/bigquery/schemas/user";
import { hash } from "bcryptjs";

@Controller("/accounts")
export class CreateAccountController {
  constructor(private bigquery: BigQueryService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: UserProps) {
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
