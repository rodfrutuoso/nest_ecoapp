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
import { AuthenticateStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/authenticate-storekeeper";

const authenticateBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private authenticateStorkeeper: AuthenticateStorekeeperUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateStorkeeper.execute({
      email,
      password,
    });

    if (result.isLeft()) throw new Error();

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
