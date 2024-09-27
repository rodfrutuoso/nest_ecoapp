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
import { ApiTags } from "@nestjs/swagger";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { IdentifierAttributionBodyDto } from "src/infra/http/swagger dto and decorators/material-movimentation/physicalDocument/dto classes/identifier-attribution.dto";
import { UserPayload } from "src/infra/auth/jwt-strategy.guard";
import { CurrentUser } from "src/infra/auth/current-user.decorator";

const identifierAttributionBodySchema = z.object({
  projectId: z.string().uuid(),
  identifier: z.number().min(1).max(1000),
});

@ApiTags("physical document")
@Controller("/physical-documents")
export class IdentifierAttributionController {
  constructor(private identifierAttribution: IdentifierAttributionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(identifierAttributionBodySchema))
    body: IdentifierAttributionBodyDto
  ) {
    const { projectId, identifier } = body;

    const result = await this.identifierAttribution.execute({
      projectId,
      identifier,
      baseId: user.baseId,
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

    return { message: "criação realizada" };
  }
}
