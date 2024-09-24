import { UserRepository } from "src/domain/material-movimentation/application/repositories/user-repository";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";
import { InMemoryBaseRepository } from "./in-memory-base-repository";
import { InMemoryContractRepository } from "./in-memory-contract-repository";

export class InMemoryUserRepository implements UserRepository {
  public items: Array<Estimator | Storekeeper> = [];

  constructor(
    private baseRepository: InMemoryBaseRepository,
    private contractRepository: InMemoryContractRepository
  ) {}

  async create(user: Storekeeper | Estimator) {
    this.items.push(user);
  }
}
