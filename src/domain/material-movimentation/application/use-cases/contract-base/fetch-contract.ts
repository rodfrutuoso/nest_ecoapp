import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { Contract } from "../../../enterprise/entities/contract";
import { ContractRepository } from "../../repositories/contract-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface FetchContractUseCaseRequest {
  page: number;
}

type FetchContractUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    contracts: Contract[];
  }
>;

@Injectable()
export class FetchContractUseCase {
  constructor(private contractRepository: ContractRepository) {}

  async execute({
    page,
  }: FetchContractUseCaseRequest): Promise<FetchContractUseCaseResponse> {
    const contracts = await this.contractRepository.findMany({
      page,
    });

    if (!contracts.length) return left(new ResourceNotFoundError());

    return right({ contracts });
  }
}
