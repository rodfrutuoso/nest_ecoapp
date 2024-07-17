import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { Storekeeper } from "../../../enterprise/entities/storekeeper";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";

interface RegisterStorekeeperUseCaseRequest {
  name: string;
  email: string;
  cpf: string;
  type: string;
  baseId: string;
}

type RegisterStorekeeperResponse = Eihter<
  ResourceAlreadyRegisteredError,
  {
    storekeeper: Storekeeper;
  }
>;

export class RegisterStorekeeperUseCase {
  constructor(private storekeeperRepository: StorekeeperRepository) {}

  async execute({
    name,
    email,
    cpf,
    type,
    baseId,
  }: RegisterStorekeeperUseCaseRequest): Promise<RegisterStorekeeperResponse> {
    const storekeeperSearch = await this.storekeeperRepository.findByEmail(
      email
    );

    if (storekeeperSearch) return left(new ResourceAlreadyRegisteredError());

    const storekeeper = Storekeeper.create({
      name,
      email,
      cpf,
      type,
      baseId: new UniqueEntityID(baseId),
    });

    await this.storekeeperRepository.create(storekeeper);

    return right({ storekeeper });
  }
}
