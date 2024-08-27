import {
    BadRequestException,
    Get,
    NotFoundException,
    Query,
  } from "@nestjs/common";
  import {  Controller, HttpCode } from "@nestjs/common";
  import { z } from "zod";
  import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
  import { FetchBaseUseCase } from "src/domain/material-movimentation/application/use-cases/contract-base/fetch-base";
  import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
  import { BasePresenter } from "src/infra/http/presenters/base-presenter";
import { ApiTags } from "@nestjs/swagger";
  
  const pageQueryParamSchema = z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1));
  
  const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
  
  type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
  
  @ApiTags("base")
  @Controller("/bases")
  export class FetchBaseController {
    constructor(private fetchBaseUseCase: FetchBaseUseCase) {}
  
    @Get()
    @HttpCode(200)
    async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
      const result = await this.fetchBaseUseCase.execute({
        page,
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
  
      const bases = result.value.bases;
  
      return { bases: bases.map(BasePresenter.toHTTP) };
    }
  }
  