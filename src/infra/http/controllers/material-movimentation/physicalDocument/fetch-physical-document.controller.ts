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
import { PhysicalDocumentWithProjectPresenter } from "src/infra/http/presenters/physical-document-with-project-presenter";
import { ApiProperty } from "@nestjs/swagger";

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

class FetchPhysicalDocumentsQuerySchema {
  @ApiProperty({
    example: "1",
    description: "Page number for pagination",
    required: false,
    default: 1,
    minimum: 1,
  })
  page!: number;
  @ApiProperty({
    example: "project-id",
    description: "project's id of the identifier",
    required: false,
  })
  projectId!: string;
  @ApiProperty({
    example: 3,
    description: "ID or identifier to be found",
    required: false,
  })
  identifier!: number;
}

@Controller("/physical-documents")
export class FetchPhysicalDocumentsController {
  constructor(private FetchPhysicalDocument: FetchPhysicalDocumentUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidationPipe(fetchPhysicalDocumentsBodySchema))
    query: FetchPhysicalDocumentsQuerySchema
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
