import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { EstimatorRepository } from "../../repositories/estimator-repository";
import { NotAllowedError } from "../errors/not-allowed-error";

interface DeleteEstimatorUseCaseRequest {
  estimatorId: string;
  authorType: string;
}

type DeleteEstimatorResponse = Eihter<NotAllowedError, null>;

@Injectable()
export class DeleteEstimatorUseCase {
  constructor(private estimatorRepository: EstimatorRepository) {}

  async execute({
    estimatorId,
    authorType,
  }: DeleteEstimatorUseCaseRequest): Promise<DeleteEstimatorResponse> {
    if (authorType != "Administrador") return left(new NotAllowedError());

    await this.estimatorRepository.delete(estimatorId);

    return right(null);
  }
}
