import {
  ConflictException,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { JwtService } from "@nestjs/jwt";

const authenticateBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private jwt: JwtService, private bigquery: BigQueryService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const [user] = await this.bigquery.user.select({ where: { email } });

    if (!user) throw new UnauthorizedException("Dados de login incorretos");

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException("Dados de login incorretos");

    const token = this.jwt.sign({ sub: user.id });

    return { access_token: token };
  }
}
