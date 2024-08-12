import { BadRequestException, ConflictException } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { RegisterProjectUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/register-project";
import { ResourceAlreadyRegisteredError } from "src/domain/material-movimentation/application/use-cases/errors/resource-already-registered-error";

const registerProjectBodySchema = z
  .object({
    project_number: z.string(),
    description: z.string(),
    type: z.string(),
    baseId: z.string().uuid(),
    city: z.string(),
  })
  .required();

type RegisterProjectBodySchema = z.infer<typeof registerProjectBodySchema>;

@Controller("/projects")
export class RegisterProjectController {
  constructor(private registerProject: RegisterProjectUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(registerProjectBodySchema))
    body: RegisterProjectBodySchema
  ) {
    const { city, description, type, project_number, baseId } = body;

    const result = await this.registerProject.execute({
      city,
      description,
      type,
      project_number,
      baseId,
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
