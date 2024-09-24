import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteStorekeeperUseCaseRequest {
  storekeeperId: string;
  authorType: string;
}

type DeleteStorekeeperResponse = Eihter<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteStorekeeperUseCase {
  constructor(private storekeeperRepository: StorekeeperRepository) {}

  async execute({
    storekeeperId,
    authorType,
  }: DeleteStorekeeperUseCaseRequest): Promise<DeleteStorekeeperResponse> {
    if (authorType != "Administrador") return left(new NotAllowedError());

    await this.storekeeperRepository.delete(storekeeperId);

    return right(null);
  }
}
