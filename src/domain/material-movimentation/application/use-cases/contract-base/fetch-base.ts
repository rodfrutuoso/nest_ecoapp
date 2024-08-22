import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { BaseRepository } from "../../repositories/base-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { BaseWithContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/base-with-contract";

interface FetchBaseUseCaseRequest {
  page: number;
}

type FetchBaseUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    bases: BaseWithContract[];
  }
>;

@Injectable()
export class FetchBaseUseCase {
  constructor(private baseRepository: BaseRepository) {}

  async execute({
    page,
  }: FetchBaseUseCaseRequest): Promise<FetchBaseUseCaseResponse> {
    const bases = await this.baseRepository.findManyWithContract({
      page,
    });

    if (!bases.length) return left(new ResourceNotFoundError());

    return right({ bases });
  }
}
