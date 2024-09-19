import { PaginationParams } from "../../src/core/repositories/pagination-params";
import { ContractRepository } from "../../src/domain/material-movimentation/application/repositories/contract-repository";
import { Contract } from "../../src/domain/material-movimentation/enterprise/entities/contract";

export class InMemoryContractRepository implements ContractRepository {
  public items: Contract[] = [];

  async findByContractName(contractName: string): Promise<Contract | null> {
    const contract = this.items.find(
      (item) => item.contractName === contractName
    );

    if (!contract) return null;

    return contract;
  }

  async findById(contractId: string): Promise<Contract | null> {
    const contract = this.items.find(
      (item) => item.id.toString() === contractId
    );

    if (!contract) return null;

    return contract;
  }

  async findByIds(contractIds: string[]): Promise<Contract[]> {
    const contracts = this.items.filter((item) =>
      contractIds.includes(item.id.toString())
    );

    return contracts;
  }

  async create(contract: Contract) {
    this.items.push(contract);
  }

  async findMany({ page }: PaginationParams): Promise<Contract[]> {
    const contracts = this.items
      .sort((a, b) => a.contractName.localeCompare(b.contractName))
      .slice((page - 1) * 40, page * 40);

    return contracts;
  }
}
