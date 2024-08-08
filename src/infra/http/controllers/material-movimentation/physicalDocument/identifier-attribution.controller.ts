import {
  BadRequestException,
  ConflictException,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { IdentifierAttributionUseCase } from "src/domain/material-movimentation/application/use-cases/physicalDocument/identifier-attribution";
import { ResourceAlreadyRegisteredError } from "src/domain/material-movimentation/application/use-cases/errors/resource-already-registered-error";

const identifierAttributionBodySchema = z.object({
  projectId: z.string().uuid(),
  identifier: z.number().min(1).max(1000),
});

type IdentifierAttributionBodySchema = z.infer<
  typeof identifierAttributionBodySchema
>;

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
        default:
          throw new BadRequestException();
      }
    }
  }
}
