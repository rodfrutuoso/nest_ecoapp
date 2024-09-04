import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { IdentifierAttributionUseCase } from "src/domain/material-movimentation/application/use-cases/physicalDocument/identifier-attribution";
import { ResourceAlreadyRegisteredError } from "src/domain/material-movimentation/application/use-cases/errors/resource-already-registered-error";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";

const identifierAttributionBodySchema = z.object({
  projectId: z.string().uuid(),
  identifier: z.number().min(1).max(1000),
});

class IdentifierAttributionBodySchema {
  @ApiProperty({
    example: "project-id",
    description: "project's id of the physical document",
  })
  projectId!: string;
  @ApiProperty({
    example: 3,
    description: "ID or identifier of the physical document",
  })
  identifier!: number;
}

@ApiTags("physical document")
@Controller("/physical-documents")
export class IdentifierAttributionController {
  constructor(private identifierAttribution: IdentifierAttributionUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(identifierAttributionBodySchema))
  async handle(@Body() body: IdentifierAttributionBodySchema) {
    const { projectId, identifier } = body;

    const result = await this.identifierAttribution.execute({
      projectId,
      identifier,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceAlreadyRegisteredError:
          throw new ConflictException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    return { message: "criação realizada" }
  }
}
