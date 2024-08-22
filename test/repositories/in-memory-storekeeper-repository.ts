import { StorekeeperWithBase } from "src/domain/material-movimentation/enterprise/entities/value-objects/storekeeper-with-base";
import { PaginationParams } from "../../src/core/repositories/pagination-params";
import { StorekeeperRepository } from "../../src/domain/material-movimentation/application/repositories/storekeeper-repository";
import { Storekeeper } from "../../src/domain/material-movimentation/enterprise/entities/storekeeper";
import { InMemoryBaseRepository } from "./in-memory-base-repository";

export class InMemoryStorekeeperRepository implements StorekeeperRepository {
  public items: Storekeeper[] = [];

  constructor(private baseRepository: InMemoryBaseRepository) {}

  async create(storekeeper: Storekeeper) {
    this.items.push(storekeeper);
  }

  async delete(storekeeperId: string) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() == storekeeperId
    );

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
    const storekeeper = this.items.find(
      (item) => item.email.toString() === email
    );

    if (!storekeeper) return null;

    return storekeeper;
  }

  async findMany(
    { page }: PaginationParams,
    baseId?: string
  ): Promise<Storekeeper[]> {
    const storekeepers = this.items
      .filter(
        (storekeeper) => !baseId || storekeeper.baseId.toString() === baseId
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * 40, page * 40);

    return storekeepers;
  }

  async findManyWithBase(
    { page }: PaginationParams,
    baseId?: string
  ): Promise<StorekeeperWithBase[]> {
    const storekeepers = this.items
      .filter(
        (storekeeper) => !baseId || storekeeper.baseId.toString() === baseId
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * 40, page * 40)
      .map((storekeeper) => {
        const base = this.baseRepository.items.find(
          (base) => base.id === storekeeper.baseId
        );

        if (!base) {
          throw new Error(`base ${storekeeper.baseId} does not exist.`);
        }

        return StorekeeperWithBase.create({
          storekeeperId: storekeeper.id,
          name: storekeeper.name,
          email: storekeeper.email,
          cpf: storekeeper.cpf,
          type: storekeeper.type,
          base: base,
          status: storekeeper.status,
          password: storekeeper.password,
        });
      });

    return storekeepers;
  }
}
