import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { BigQueryService } from "src/bigquery/bigquery.service";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { JwtService } from "@nestjs/jwt";

// const createAccountBodySchema = z
//   .object({
//     name: z.string(),
//     email: z.string().email(),
//     password: z.string(),
//   })
//   .required();

// type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  // @HttpCode(201)
  // @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  // async handle(@Body() body: CreateAccountBodySchema) {
  async handle() {
    const token = this.jwt.sign({ sub: "user-id" });
    return token;
  }
}
