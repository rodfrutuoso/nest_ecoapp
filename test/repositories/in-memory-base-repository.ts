import { PaginationParams } from "../../src/core/repositories/pagination-params";
import { BaseRepository } from "../../src/domain/material-movimentation/application/repositories/base-repository";
import { Base } from "../../src/domain/material-movimentation/enterprise/entities/base";

export class InMemoryBaseRepository implements BaseRepository {
  public items: Base[] = [];

  async findByBaseName(baseName: string): Promise<Base | null> {
    const base = this.items.find(
      (item) => item.baseName === baseName
    );

    if (!base) return null;

    return base;
  }

  async create(base: Base) {
    this.items.push(base);
  }

  async findMany(
    { page }: PaginationParams,
  ): Promise<Base[]> {
    const bases = this.items
      .sort((a, b) => a.baseName.localeCompare(b.baseName))
      .slice((page - 1) * 40, page * 40);

    return bases;
  }
}
