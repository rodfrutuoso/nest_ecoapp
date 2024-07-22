import { UseCaseError } from "../../../../../core/errors/use-case-error";

export class ResourceAlreadyRegisteredError extends Error implements UseCaseError {
  constructor() {
    super("Recurso já foi cadastrado");
  }
}
