import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { EstimatorRepository } from "../../repositories/estimator-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { HashGenerator } from "../../cryptography/hash-generator";
import { ContractRepository } from "../../repositories/contract-repository";
import { UserType } from "src/core/types/user-type";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";

interface EditEstimatorUseCaseRequest {
  estimator: Estimator;
  authorId: string;
  authorType: string;
  type?: string;
  contractId?: string;
  status?: string;
  password?: string;
}

type EditEstimatorResponse = Eihter<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class EditEstimatorUseCase {
  constructor(
    private estimatorRepository: EstimatorRepository,
    private hashGenerator: HashGenerator,
    private contractRepository: ContractRepository
  ) {}

  async execute({
    estimator,
    authorId,
    authorType,
    type,
    contractId,
    status,
    password,
  }: EditEstimatorUseCaseRequest): Promise<EditEstimatorResponse> {
    if (authorType !== "Administrador" && authorId !== estimator.id.toString())
      return left(new NotAllowedError());

    if (contractId) {
      const contract = await this.contractRepository.findById(contractId);
      if (!contract)
        return left(new ResourceNotFoundError("contractId não encontrado"));
    }

    estimator.type = (type ?? estimator.type) as UserType;
    estimator.contractId =
      contractId === undefined
        ? estimator.contractId
        : new UniqueEntityID(contractId);
    estimator.status = status ?? estimator.status;
    estimator.password =
      password === undefined
        ? estimator.password
        : await this.hashGenerator.hash(password);

    await this.estimatorRepository.save(estimator);

    return right(null);
  }
}
