import {
  BadRequestException,
  Get,
  NotFoundException,
  Query,
} from "@nestjs/common";
import {  Controller, HttpCode } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/infra/http/pipes/zod-validation.pipe";
import { FetchContractUseCase } from "src/domain/material-movimentation/application/use-cases/contract-base/fetch-contract";
import { MaterialPresenter } from "../../../presenters/material-presenter";
import { ResourceNotFoundError } from "src/domain/material-movimentation/application/use-cases/errors/resource-not-found-error";
import { ContractPresenter } from "src/infra/http/presenters/contract-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/contracts")
export class FetchContractController {
  constructor(private fetchContractUseCase: FetchContractUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchContractUseCase.execute({
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

    const contracts = result.value.contracts;

    return { contracts: contracts.map(ContractPresenter.toHTTP) };
  }
}
