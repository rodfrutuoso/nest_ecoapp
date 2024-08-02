import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { Storekeeper } from "../../../enterprise/entities/storekeeper";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface GetStorekeeperByIdUseCaseRequest {
  storekeeperId: string;
}

type GetStorekeeperByIdUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    storekeeper: Storekeeper;
  }
>;
@Injectable()
export class GetStorekeeperByIdUseCase {
  constructor(private storekeeperRepository: StorekeeperRepository) {}

  async execute({
    storekeeperId,
  }: GetStorekeeperByIdUseCaseRequest): Promise<GetStorekeeperByIdUseCaseResponse> {
    const storekeeper = await this.storekeeperRepository.findById(storekeeperId);

    if (!storekeeper) return left(new ResourceNotFoundError());

    return right({ storekeeper });
  }
}