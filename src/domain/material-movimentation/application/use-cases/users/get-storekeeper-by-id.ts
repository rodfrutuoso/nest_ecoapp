import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { StorekeeperWithBase } from "src/domain/material-movimentation/enterprise/entities/value-objects/storekeeper-with-base";

interface GetAccountByidUseCaseRequest {
  storekeeperId: string;
}

type GetAccountByidUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    storekeeper: StorekeeperWithBase;
  }
>;
@Injectable()
export class GetAccountByidUseCase {
  constructor(private storekeeperRepository: StorekeeperRepository) {}

  async execute({
    storekeeperId,
  }: GetAccountByidUseCaseRequest): Promise<GetAccountByidUseCaseResponse> {
    const storekeeper = await this.storekeeperRepository.findByIdWithBase(storekeeperId);

    if (!storekeeper) return left(new ResourceNotFoundError("Id do almoxarife não encontrado"));

    return right({ storekeeper });
  }
}
