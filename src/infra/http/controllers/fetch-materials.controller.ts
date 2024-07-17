import { Get, NotFoundException, Query, UseGuards } from "@nestjs/common";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { JwtAuthGuard } from "src/infra/auth/jwt-auth.guard";

const fetchMaterialBodySchema = z
  .object({
    type: z.string().optional(),
    contractId: z.string().uuid(),
  })
  .required();

type FetchMaterialBodySchema = z.infer<typeof fetchMaterialBodySchema>;

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/materials")
@UseGuards(JwtAuthGuard)
export class FetchMaterialController {
  constructor(private bigquery: BigQueryService) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Body(new ZodValidationPipe(fetchMaterialBodySchema))
    body: FetchMaterialBodySchema
  ) {
    const { type, contractId } = body;

    const pageCount = 40;

    const materials = await this.bigquery.material.select({
      where: { type, contractId },
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "code", direction: "ASC" },
    });

    if (materials.length < 1)
      throw new NotFoundException("Restuldado da pesquisa sem dados");

    return { materials };
  }
}
