import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import { PaginationParams } from "../../src/core/repositories/pagination-params";
import { StorekeeperRepository } from "../../src/domain/material-movimentation/application/repositories/storekeeper-repository";
import { Storekeeper } from "../../src/domain/material-movimentation/enterprise/entities/storekeeper";

export class InMemoryStorekeeperRepository implements StorekeeperRepository {
  public items: Storekeeper[] = [];

  async create(storekeeper: Storekeeper) {
    this.items.push(storekeeper);
  }

  async delete(storekeeperId: string) {
    const itemIndex = this.items.findIndex((item) => item.id.toString() == storekeeperId);

    this.items.splice(itemIndex, 1);
  }

  async save(storekeeper: Storekeeper) {
    const itemIndex = this.items.findIndex((item) => item.id == storekeeper.id);

    this.items[itemIndex] = storekeeper;
  }

  async findById(id: string): Promise<Storekeeper | null> {
    const storekeeper = this.items.find((item) => item.id.toString() === id);

    if (!storekeeper) return null;

    return storekeeper;
  }

  async findByEmail(email: string): Promise<Storekeeper | null> {
    const storekeeper = this.items.find((item) => item.email.toString() === email);

    if (!storekeeper) return null;

    return storekeeper;
  }

  async findMany(
    { page }: PaginationParams,
    baseId?: string
  ): Promise<Storekeeper[]> {
    const storekeepers = this.items
      .filter(
        (storekeeper) =>
          !baseId || storekeeper.baseId.toString() === baseId
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * 40, page * 40);

    return storekeepers;
  }
}
