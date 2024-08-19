import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { Movimentation } from "../../../enterprise/entities/movimentation";
import { MovimentationRepository } from "../../repositories/movimentation-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface FetchMovimentationHistoryUseCaseRequest {
  page: number;
  baseId: string;
  storekeeperId?: string;
  projectId?: string;
  materialId?: string;
  startDate?: Date;
  endDate?: Date;
}

type FetchMovimentationHistoryUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    movimentations: Movimentation[];
  }
>;

@Injectable()
export class FetchMovimentationHistoryUseCase {
  constructor(private movimentationRepository: MovimentationRepository) {}

  async execute({
    page,
    baseId,
    storekeeperId,
    projectId,
    materialId,
    startDate,
    endDate,
  }: FetchMovimentationHistoryUseCaseRequest): Promise<FetchMovimentationHistoryUseCaseResponse> {
    const movimentations = await this.movimentationRepository.findManyHistory(
      {
        page,
      },
      baseId,
      storekeeperId,
      projectId,
      materialId,
      startDate,
      endDate
    );

    if (!movimentations.length) return left(new ResourceNotFoundError());

    return right({ movimentations });
  }
}
