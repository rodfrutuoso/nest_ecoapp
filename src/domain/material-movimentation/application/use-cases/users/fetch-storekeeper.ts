import { Eihter, left, right } from "../../../../../core/either";
import { Storekeeper } from "../../../enterprise/entities/storekeeper";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface FetchStorekeeperUseCaseRequest {
  page: number;
  baseId?: string;
}

type FetchStorekeeperUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    storekeepers: Storekeeper[];
  }
>;

export class FetchStorekeeperUseCase {
  constructor(private storekeeperRepository: StorekeeperRepository) {}

  async execute({
    page,
    baseId,
  }: FetchStorekeeperUseCaseRequest): Promise<FetchStorekeeperUseCaseResponse> {
    const storekeepers = await this.storekeeperRepository.findMany(
      {
        page,
      },
      baseId,
    );

    if (!storekeepers.length) return left(new ResourceNotFoundError());

    return right({ storekeepers });
  }
}
