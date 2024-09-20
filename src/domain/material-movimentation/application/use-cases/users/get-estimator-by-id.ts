import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { EstimatorRepository } from "../../repositories/estimator-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { EstimatorWithContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/estimator-with-contract";

interface GetEstimatorByIdUseCaseRequest {
  estimatorId: string;
}

type GetEstimatorByIdUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    estimator: EstimatorWithContract;
  }
>;
@Injectable()
export class GetEstimatorByIdUseCase {
  constructor(private estimatorRepository: EstimatorRepository) {}

  async execute({
    estimatorId,
  }: GetEstimatorByIdUseCaseRequest): Promise<GetEstimatorByIdUseCaseResponse> {
    const estimator = await this.estimatorRepository.findByIdWithContract(
      estimatorId
    );

    if (!estimator)
      return left(new ResourceNotFoundError("Id de usuário não encontrado"));

    return right({ estimator });
  }
}
