import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { EstimatorRepository } from "../../repositories/estimator-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { HashGenerator } from "../../cryptography/hash-generator";
import { ContractRepository } from "../../repositories/contract-repository";
import { UserType } from "src/core/types/user-type";

interface EditEstimatorUseCaseRequest {
  estimatorId: string;
  authorId: string;
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
    estimatorId,
    authorId,
    type,
    contractId,
    status,
    password,
  }: EditEstimatorUseCaseRequest): Promise<EditEstimatorResponse> {
    const author = await this.estimatorRepository.findById(authorId);

    if (!author)
      return left(new ResourceNotFoundError("authorId não encontrado"));

    if (author.type !== "Administrador" && authorId !== estimatorId)
      return left(new NotAllowedError());

    const estimator = await this.estimatorRepository.findById(estimatorId);

    if (!estimator)
      return left(
        new ResourceNotFoundError("id do usuário editado não encontrado")
      );

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
