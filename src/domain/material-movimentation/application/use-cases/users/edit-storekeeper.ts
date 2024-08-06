import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { HashGenerator } from "../../cryptography/hash-generator";

interface EditStorekeeperUseCaseRequest {
  storekeeperId: string;
  authorId: string;
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
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    storekeeperId,
    authorId,
    type,
    baseId,
    status,
    password,
  }: EditStorekeeperUseCaseRequest): Promise<EditStorekeeperResponse> {
    const author = await this.storekeeperRepository.findById(authorId);

    if (!author) return left(new ResourceNotFoundError());

    if (author.type != "Administrator") return left(new NotAllowedError());

    const storekeeper = await this.storekeeperRepository.findById(
      storekeeperId
    );

    if (!storekeeper) return left(new ResourceNotFoundError());

    storekeeper.type = type ?? storekeeper.type;
    storekeeper.baseId =
      baseId === undefined ? storekeeper.baseId : new UniqueEntityID(baseId);
    storekeeper.status = status ?? storekeeper.status;
    storekeeper.password =
      password === undefined
        ? storekeeper.password
        : await this.hashGenerator.hash(password);

    await this.storekeeperRepository.save(storekeeper);

    return right(null);
  }
}
