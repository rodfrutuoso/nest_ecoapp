import { BaseWithContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/base-with-contract";
import { PaginationParams } from "../../src/core/repositories/pagination-params";
import { BaseRepository } from "../../src/domain/material-movimentation/application/repositories/base-repository";
import { Base } from "../../src/domain/material-movimentation/enterprise/entities/base";
import { InMemoryContractRepository } from "./in-memory-contract-repository";

export class InMemoryBaseRepository implements BaseRepository {
  public items: Base[] = [];

  constructor(private contractRepository: InMemoryContractRepository) {}

  async findByBaseName(baseName: string): Promise<Base | null> {
    const base = this.items.find((item) => item.baseName === baseName);

    if (!base) return null;

    return base;
  }

  async create(base: Base) {
    this.items.push(base);
  }

  async findMany({ page }: PaginationParams): Promise<Base[]> {
    const bases = this.items
      .sort((a, b) => a.baseName.localeCompare(b.baseName))
      .slice((page - 1) * 40, page * 40);

    return bases;
  }

  async findManyWithContract({
    page,
  }: PaginationParams): Promise<BaseWithContract[]> {
    const bases = this.items
      .sort((a, b) => a.baseName.localeCompare(b.baseName))
      .slice((page - 1) * 40, page * 40)
      .map((base) => {
        const contract = this.contractRepository.items.find(
          (contract) => contract.id === base.contractId
        );

        if (!contract) {
          throw new Error(`contract ${base.contractId} does not exist.`);
        }

        return BaseWithContract.create({
          baseId: base.id,
          baseName: base.baseName,
          contractName: contract.contractName,
        });
      });

    return bases;
  }
}
