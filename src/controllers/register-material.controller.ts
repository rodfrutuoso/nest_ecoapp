import { ConflictException, Req, UseGuards, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { BigQueryService } from "src/bigquery/bigquery.service";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Request } from "express";
import { CurrentUser } from "src/auth/current-user.decorator";
import { UserPayload } from "src/auth/jwt-strategy.guard";

// const registerMaterialBodySchema = z
//   .object({
//     name: z.string(),
//     email: z.string().email(),
//     password: z.string(),
//   })
//   .required();

// type RegisterMaterialBodySchema = z.infer<typeof registerMaterialBodySchema>;

@Controller("/materials")
@UseGuards(JwtAuthGuard)
export class RegisterMaterialController {
  constructor(private bigquery: BigQueryService) {}

  @Post()
  //   @HttpCode(201)
  //   @UsePipes(new ZodValidationPipe(registerMaterialBodySchema))
  //   async handle(@Body() body: RegisterMaterialBodySchema) {
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user);
    return "ok";
  }
}
