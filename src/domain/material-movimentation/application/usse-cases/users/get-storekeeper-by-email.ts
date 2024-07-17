import { Eihter, left, right } from "../../../../../core/either";
import { Storekeeper } from "../../../enterprise/entities/storekeeper";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface GetStorekeeperByEmailUseCaseRequest {
  email: string;
}

type GetStorekeeperByEmailUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    storekeepers: Storekeeper;
  }
>;

export class GetStorekeeperByEmailUseCase {
  constructor(private storekeeperRepository: StorekeeperRepository) {}

  async execute({
    email,
  }: GetStorekeeperByEmailUseCaseRequest): Promise<GetStorekeeperByEmailUseCaseResponse> {
    const storekeepers = await this.storekeeperRepository.findByEmail(email);

    if (!storekeepers) return left(new ResourceNotFoundError());

    return right({ storekeepers });
  }
}
