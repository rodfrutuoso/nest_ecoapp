import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { Base } from "../../../enterprise/entities/base";
import { BaseRepository } from "../../repositories/base-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";

interface RegisterBaseUseCaseRequest {
  baseName: string;
  contractID: string;
}

type RegisterBaseResponse = Eihter<
  ResourceAlreadyRegisteredError,
  {
    base: Base;
  }
>;

export class RegisterBaseUseCase {
  constructor(private baseRepository: BaseRepository) {}

  async execute({
    baseName,
    contractID,
  }: RegisterBaseUseCaseRequest): Promise<RegisterBaseResponse> {
    const baseSearch = await this.baseRepository.findByBaseName(baseName);

    if (baseSearch) return left(new ResourceAlreadyRegisteredError());

    const base = Base.create({
      baseName,
      contractID: new UniqueEntityID(contractID),
    });

    await this.baseRepository.create(base);

    return right({ base });
  }
}
