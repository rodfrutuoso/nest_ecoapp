import {
  BadRequestException,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { AuthenticateStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/authenticate-storekeeper";
import { WrogCredentialsError } from "src/domain/material-movimentation/application/use-cases/errors/wrong-credentials";
import { Public } from "../../../../auth/public.guard";

const authenticateBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
@Public()
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

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrogCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
