import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { StorekeeperWithBase } from "src/domain/material-movimentation/enterprise/entities/value-objects/storekeeper-with-base";

interface GetStorekeeperByIdUseCaseRequest {
  storekeeperId: string;
}

type GetStorekeeperByIdUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    storekeeper: StorekeeperWithBase;
  }
>;
@Injectable()
export class GetStorekeeperByIdUseCase {
  constructor(private storekeeperRepository: StorekeeperRepository) {}

  async execute({
    storekeeperId,
  }: GetStorekeeperByIdUseCaseRequest): Promise<GetStorekeeperByIdUseCaseResponse> {
    const storekeeper = await this.storekeeperRepository.findByIdWithBase(storekeeperId);

    if (!storekeeper) return left(new ResourceNotFoundError("Id do almoxarife não encontrado"));

    return right({ storekeeper });
  }
}
