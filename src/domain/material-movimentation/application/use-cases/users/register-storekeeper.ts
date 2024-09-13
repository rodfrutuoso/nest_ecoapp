import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { Storekeeper } from "../../../enterprise/entities/storekeeper";
import { HashGenerator } from "../../cryptography/hash-generator";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";
import { BaseRepository } from "../../repositories/base-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UserType } from "src/core/types/user-type";
import { WrongTypeError } from "../errors/wrong-type";

interface RegisterStorekeeperUseCaseRequest {
  name: string;
  email: string;
  cpf: string;
  type: string;
  baseId: string;
  password: string;
}

type RegisterStorekeeperResponse = Eihter<
  ResourceAlreadyRegisteredError | ResourceNotFoundError,
  {
    storekeeper: Storekeeper;
  }
>;

@Injectable()
export class RegisterStorekeeperUseCase {
  constructor(
    private storekeeperRepository: StorekeeperRepository,
    private hashGenerator: HashGenerator,
    private baseRepository: BaseRepository
  ) {}

  async execute({
    name,
    email,
    cpf,
    type,
    baseId,
    password,
  }: RegisterStorekeeperUseCaseRequest): Promise<RegisterStorekeeperResponse> {
    const base = await this.baseRepository.findById(baseId);
    if (!base) return left(new ResourceNotFoundError("baseId não encontrado"));

    const storekeeperSearch = await this.storekeeperRepository.findByEmail(
      email
    );

    if (storekeeperSearch)
      return left(
        new ResourceAlreadyRegisteredError(
          "O email informado já foi cadastrado!"
        )
      );

    if (!this.isUserType(type))
      return left(
        new WrongTypeError(
          "o 'type' informado precisa ser 'Administrador' ou 'Orçamentista' ou 'Almoxarife'"
        )
      );

    const storekeeper = Storekeeper.create({
      name,
      email,
      cpf,
      type,
      baseId: new UniqueEntityID(baseId),
      contractId: base.contractId,
      password: await this.hashGenerator.hash(password),
    });

    await this.storekeeperRepository.create(storekeeper);

    return right({ storekeeper });
  }

  private isUserType(type: string): type is UserType {
    return ["Administrador", "Orçamentista", "Almoxarife"].includes(
      type as UserType
    );
  }
}
