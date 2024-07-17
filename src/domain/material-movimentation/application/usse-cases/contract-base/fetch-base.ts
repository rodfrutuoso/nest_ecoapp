import { Eihter, left, right } from "../../../../../core/either";
import { Base } from "../../../enterprise/entities/base";
import { BaseRepository } from "../../repositories/base-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface FetchBaseUseCaseRequest {
  page: number;
}

type FetchBaseUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    bases: Base[];
  }
>;

export class FetchBaseUseCase {
  constructor(private baseRepository: BaseRepository) {}

  async execute({
    page,
  }: FetchBaseUseCaseRequest): Promise<FetchBaseUseCaseResponse> {
    const bases = await this.baseRepository.findMany({
      page,
    });

    if (!bases.length) return left(new ResourceNotFoundError());

    return right({ bases });
  }
}
