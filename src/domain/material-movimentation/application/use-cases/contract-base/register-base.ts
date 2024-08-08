import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { Base } from "../../../enterprise/entities/base";
import { BaseRepository } from "../../repositories/base-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";

interface RegisterBaseUseCaseRequest {
  baseName: string;
  contractId: string;
}

type RegisterBaseResponse = Eihter<
  ResourceAlreadyRegisteredError,
  {
    base: Base;
  }
>;

@Injectable()
export class RegisterBaseUseCase {
  constructor(private baseRepository: BaseRepository) {}

  async execute({
    baseName,
    contractId,
  }: RegisterBaseUseCaseRequest): Promise<RegisterBaseResponse> {
    const baseSearch = await this.baseRepository.findByBaseName(baseName);

    if (baseSearch) return left(new ResourceAlreadyRegisteredError());

    const base = Base.create({
      baseName,
      contractId: new UniqueEntityID(contractId),
    });

    await this.baseRepository.create(base);

    return right({ base });
  }
}
