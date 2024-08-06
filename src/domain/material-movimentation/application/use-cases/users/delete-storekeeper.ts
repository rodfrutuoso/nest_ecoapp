import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { NotAllowedError } from "../errors/not-allowed-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface DeleteStorekeeperUseCaseRequest {
  storekeeperId: string;
  authorId: string;
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
    authorId,
  }: DeleteStorekeeperUseCaseRequest): Promise<DeleteStorekeeperResponse> {
    const author = await this.storekeeperRepository.findById(authorId);

    if (!author) return left(new ResourceNotFoundError()); //throw new Error("usuário não encontrado");

    if (author.type != "Administrator") return left(new NotAllowedError());

    const storekeeper = await this.storekeeperRepository.findById(
      storekeeperId
    );

    if (!storekeeper) return left(new ResourceNotFoundError());

    await this.storekeeperRepository.delete(storekeeperId);

    return right(null);
  }
}
