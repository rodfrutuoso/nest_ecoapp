import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { FetchPhysicalDocumentUseCase } from "src/domain/material-movimentation/application/use-cases/physicalDocument/fetch-physical-document";
import { PhysicalDocumentWithProjectPresenter } from "src/infra/http/presenters/physical-document-with-project-presenter";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { FetchPhysicalDocumentsDecorator } from "src/infra/http/swagger dto and decorators/material-movimentation/physicalDocument/response decorators/fetch-physical-document.decorator";
import { FetchPhysicalDocumentsQueryDto } from "src/infra/http/swagger dto and decorators/material-movimentation/physicalDocument/dto classes/fetch-physical-document.dto";

const fetchPhysicalDocumentsBodySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1)),
  projectId: z.string().uuid().optional(),
  identifier: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(1000))
    .optional(),
});

@ApiTags("physical document")
@Controller("/physical-documents")
export class FetchPhysicalDocumentsController {
  constructor(private FetchPhysicalDocument: FetchPhysicalDocumentUseCase) {}

  @Get()
  @HttpCode(200)
  @FetchPhysicalDocumentsDecorator()
  async handle(
    @Query(new ZodValidationPipe(fetchPhysicalDocumentsBodySchema))
    query: FetchPhysicalDocumentsQueryDto
  ) {
    const { page, identifier, projectId } = query;

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
        PhysicalDocumentWithProjectPresenter.toHTTP
      ),
    };
  }
}
