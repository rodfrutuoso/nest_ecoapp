import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { EstimatorRepository } from "../../repositories/estimator-repository";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface VerifyAuthorTypeUseCaseRequest {
  authorId: string;
  userId: string;
}

type VerifyAuthorTypeResponse = Eihter<
  ResourceNotFoundError,
  { author: Storekeeper | Estimator; user: Storekeeper | Estimator }
>;

@Injectable()
export class VerifyAuthorTypeUseCase {
  constructor(
    private storekeeperRepository: StorekeeperRepository,
    private estimatorRepository: EstimatorRepository
  ) {}

  async execute({
    authorId,
    userId,
  }: VerifyAuthorTypeUseCaseRequest): Promise<VerifyAuthorTypeResponse> {
    const { author, user } = await this.SearchIdsOnAllEntities(
      authorId,
      userId
    );

    if (!user)
      return left(
        new ResourceNotFoundError("Id do usuário modificado não encontrado")
      );

    if (!author)
      return left(new ResourceNotFoundError("Id do autor não encontrado"));

    return right({ author, user });
  }

  private async SearchIdsOnAllEntities(authorId, userId) {
    const storekeepers = await this.storekeeperRepository.findByIds([
      authorId,
      userId,
    ]);

    const estimators = await this.estimatorRepository.findByIds([
      authorId,
      userId,
    ]);

    const author =
      storekeepers.find(
        (storekeeper) => storekeeper.id.toString() === authorId
      ) ?? estimators.find((estimator) => estimator.id.toString() === authorId);

    const user =
      storekeepers.find(
        (storekeeper) => storekeeper.id.toString() === userId
      ) ?? estimators.find((estimator) => estimator.id.toString() === userId);

    return { author: author, user: user };
  }
}
