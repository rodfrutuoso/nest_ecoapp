import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { FetchPhysicalDocumentUseCase } from "src/domain/material-movimentation/application/use-cases/physicalDocument/fetch-physical-document";
import { PhysicalDocumentPresenter } from "src/infra/http/presenters/physical-document-presenter";

const fetchPhysicalDocumentsBodySchema = z.object({
  projectId: z.string().uuid().optional(),
  identifier: z.number().min(1).max(1000).optional(),
});

type FetchPhysicalDocumentsBodySchema = z.infer<
  typeof fetchPhysicalDocumentsBodySchema
>;

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/physical-documents")
export class FetchPhysicalDocumentsController {
  constructor(private FetchPhysicalDocument: FetchPhysicalDocumentUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
    @Body(new ZodValidationPipe(fetchPhysicalDocumentsBodySchema))
    body: FetchPhysicalDocumentsBodySchema
  ) {
    const { identifier, projectId } = body;

    const result = await this.FetchPhysicalDocument.execute({
      page,
      identifier,
      projectId,
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

    const physicalDocuments = result.value.physicaldocuments;

    return {
      physicalDocuments: physicalDocuments.map(
        PhysicalDocumentPresenter.toHTTP
      ),
    };
  }
}
