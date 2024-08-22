import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { StorekeeperWithBase } from "src/domain/material-movimentation/enterprise/entities/value-objects/storekeeper-with-base";

interface FetchStorekeeperUseCaseRequest {
  page: number;
  baseId?: string;
}

type FetchStorekeeperUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    storekeepers: StorekeeperWithBase[];
  }
>;

@Injectable()
export class FetchStorekeeperUseCase {
  constructor(private storekeeperRepository: StorekeeperRepository) {}

  async execute({
    page,
    baseId,
  }: FetchStorekeeperUseCaseRequest): Promise<FetchStorekeeperUseCaseResponse> {
    const storekeepers = await this.storekeeperRepository.findManyWithBase(
      {
        page,
      },
      baseId
    );

    if (!storekeepers.length) return left(new ResourceNotFoundError());

    return right({ storekeepers });
  }
}
