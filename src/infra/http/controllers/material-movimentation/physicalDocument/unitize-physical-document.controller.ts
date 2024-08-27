import {
  BadRequestException,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from "@nestjs/common";
import { Body, Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { UnitizePhysicalDocumentUseCase } from "src/domain/material-movimentation/application/use-cases/physicalDocument/unitize-physical-document";
import { NotAllowedError } from "src/domain/material-movimentation/application/use-cases/errors/not-allowed-error";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

const unitizePhysicalDocumentBodySchema = z.object({
  unitized: z.boolean(),
});

class UnitizePhysicalDocumentBodySchema {
  @ApiProperty({
    example: true,
    description: "edit if a project is unitized or not",
  })
  unitized!: boolean;
}

@ApiTags("physical document")
@Controller("/physical-documents/:id")
export class UnitizePhysicalDocumentController {
  constructor(
    private unitizePhysicalDocument: UnitizePhysicalDocumentUseCase
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(unitizePhysicalDocumentBodySchema))
    body: UnitizePhysicalDocumentBodySchema,
    @Param("id") physicaldDocumentid: string
  ) {
    const { unitized } = body;

    const result = await this.unitizePhysicalDocument.execute({
      physicaldDocumentid,
      unitized,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException();
        case ResourceNotFoundError:
          throw new NotFoundException();
        default:
          throw new BadRequestException();
      }
    }
  }
}
