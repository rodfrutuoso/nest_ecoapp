import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { Estimator } from "../../../enterprise/entities/estimator";
import { HashGenerator } from "../../cryptography/hash-generator";
import { EstimatorRepository } from "../../repositories/estimator-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";
import { BaseRepository } from "../../repositories/base-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UserType } from "src/core/types/user-type";
import { WrongTypeError } from "../errors/wrong-type";

interface RegisterEstimatorUseCaseRequest {
  name: string;
  email: string;
  cpf: string;
  type: string;
  contractId: string;
  password: string;
}

type RegisterEstimatorResponse = Eihter<
  ResourceAlreadyRegisteredError | ResourceNotFoundError,
  {
    estimator: Estimator;
  }
>;

@Injectable()
export class RegisterEstimatorUseCase {
  constructor(
    private estimatorRepository: EstimatorRepository,
    private hashGenerator: HashGenerator,
    private baseRepository: BaseRepository
  ) {}

  async execute({
    name,
    email,
    cpf,
    type,
    contractId,
    password,
  }: RegisterEstimatorUseCaseRequest): Promise<RegisterEstimatorResponse> {
    const [base] = await this.baseRepository.findManyByContractId(contractId);
    if (!base)
      return left(
        new ResourceNotFoundError(
          "Não há bases registradas com esse contractId ou esse contractId não existe"
        )
      );

    const estimatorSearch = await this.estimatorRepository.findByEmail(email);

    if (estimatorSearch)
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

    const estimator = Estimator.create({
      name,
      email,
      cpf,
      type,
      baseId: base.id,
      contractId: new UniqueEntityID(contractId),
      password: await this.hashGenerator.hash(password),
    });

    await this.estimatorRepository.create(estimator);

    return right({ estimator });
  }

  private isUserType(type: string): type is "Orçamentista" {
    return ["Orçamentista"].includes(type as UserType);
  }
}
