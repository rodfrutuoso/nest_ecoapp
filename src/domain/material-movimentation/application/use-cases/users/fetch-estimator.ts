import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { EstimatorRepository } from "../../repositories/estimator-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { EstimatorWithContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/estimator-with-contract";

interface FetchEstimatorUseCaseRequest {
  page: number;
  contractId?: string;
  name?: string;
}

type FetchEstimatorUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    estimators: EstimatorWithContract[];
  }
>;

@Injectable()
export class FetchEstimatorUseCase {
  constructor(private estimatorRepository: EstimatorRepository) {}

  async execute({
    page,
    contractId,
    name,
  }: FetchEstimatorUseCaseRequest): Promise<FetchEstimatorUseCaseResponse> {
    const estimators = await this.estimatorRepository.findManyWithContract(
      {
        page,
      },
      contractId,
      name
    );

    if (!estimators.length) return left(new ResourceNotFoundError());

    return right({ estimators });
  }
}
