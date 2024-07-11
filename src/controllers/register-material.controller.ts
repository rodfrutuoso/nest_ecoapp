import { ConflictException, UseGuards } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { BigQueryService } from "src/bigquery/bigquery.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/auth/current-user.decorator";
import { UserPayload } from "src/auth/jwt-strategy.guard";

const registerMaterialBodySchema = z
  .object({
    code: z.number(),
    description: z.string(),
    type: z.string(),
    unit: z.string(),
    contractId: z.string().uuid(),
  })
  .required();

type RegisterMaterialBodySchema = z.infer<typeof registerMaterialBodySchema>;

@Controller("/materials")
@UseGuards(JwtAuthGuard)
export class RegisterMaterialController {
  constructor(private bigquery: BigQueryService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(registerMaterialBodySchema))
    body: RegisterMaterialBodySchema
  ) {
    const { code, description, type, unit, contractId } = body;

    const verifyCode = await this.bigquery.material.select({ where: { code } });

    if (verifyCode.length > 0)
      throw new ConflictException("Já existe um material com esse código");

    console.log(user.sub);

    await this.bigquery.material.create([
      { code, contractId, description, type, unit },
    ]);
  }
}
