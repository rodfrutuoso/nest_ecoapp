import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { JwtAuthGuard } from "src/infra/auth/jwt-auth.guard";
import { FetchMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/fetch-material";
import { MaterialPresenter } from "../presenters/material-presenter";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";

const fetchMaterialBodySchema = z.object({
  type: z.string().optional(),
  contractId: z.string().uuid(),
});

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
  constructor(private fetchMaterialUseCase: FetchMaterialUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Body(new ZodValidationPipe(fetchMaterialBodySchema))
    body: FetchMaterialBodySchema
  ) {
    const { type, contractId } = body;

    const result = await this.fetchMaterialUseCase.execute({
      contractId,
      page,
      type,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const materials = result.value.materials;

    return { materials: materials.map(MaterialPresenter.toHTTP) };
  }
}
