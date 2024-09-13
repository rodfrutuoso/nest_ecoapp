import { UseCaseError } from "../../../../../core/errors/use-case-error";

export class WrongTypeError extends Error implements UseCaseError {
  constructor(message: string = "O tipo de um parâmetro fornecido é inválido") {
    super(message);
  }
}
