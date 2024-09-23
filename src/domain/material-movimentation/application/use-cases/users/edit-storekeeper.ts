import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { HashGenerator } from "../../cryptography/hash-generator";
import { BaseRepository } from "../../repositories/base-repository";
import { UserType } from "src/core/types/user-type";
import { Base } from "src/domain/material-movimentation/enterprise/entities/base";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";

interface EditStorekeeperUseCaseRequest {
  storekeeper: Storekeeper;
  authorId: string;
  authorType: string;
  type?: string;
  baseId?: string;
  status?: string;
  password?: string;
}

type EditStorekeeperResponse = Eihter<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class EditStorekeeperUseCase {
  constructor(
    private storekeeperRepository: StorekeeperRepository,
    private hashGenerator: HashGenerator,
    private baseRepository: BaseRepository
  ) {}

  async execute({
    storekeeper,
    authorId,
    authorType,
    type,
    baseId,
    status,
    password,
  }: EditStorekeeperUseCaseRequest): Promise<EditStorekeeperResponse> {
    if (authorType != "Administrador" && authorId !== storekeeper.id.toString())
      return left(new NotAllowedError());

    let base: Base | null = null;
    if (baseId) {
      base = await this.baseRepository.findById(baseId);
      if (!base)
        return left(new ResourceNotFoundError("baseId não encontrado"));
    }

    storekeeper.type = (type ?? storekeeper.type) as UserType;
    storekeeper.baseId =
      baseId === undefined ? storekeeper.baseId : new UniqueEntityID(baseId);
    storekeeper.status = status ?? storekeeper.status;
    storekeeper.password =
      password === undefined
        ? storekeeper.password
        : await this.hashGenerator.hash(password);
    storekeeper.contractId =
      base === null ? storekeeper.contractId : base.contractId;

    await this.storekeeperRepository.save(storekeeper);

    return right(null);
  }
}
