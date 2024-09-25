import { UserRepository } from "src/domain/material-movimentation/application/repositories/user-repository";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";
import { InMemoryBaseRepository } from "./in-memory-base-repository";
import { InMemoryContractRepository } from "./in-memory-contract-repository";
import { UserWithBaseContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/user-with-base-contract";

export class InMemoryUserRepository implements UserRepository {
  public items: Array<Estimator | Storekeeper> = [];

  constructor(
    private baseRepository: InMemoryBaseRepository,
    private contractRepository: InMemoryContractRepository
  ) {}

  async create(user: Storekeeper | Estimator) {
    this.items.push(user);
  }

  async findByIdWithBaseContract(
    id: string
  ): Promise<UserWithBaseContract | null> {
    const user = this.items.find((item) => item.id.toString() === id);
    if (!user) return null;

    const base = this.baseRepository.items.find(
      (base) => base.id === user.baseId
    );

    const contract = this.contractRepository.items.find(
      (contract) => contract.id === user.contractId
    );

    if (!base) {
      throw new Error(`base ${user.baseId} does not exist.`);
    }

    if (!contract) {
      throw new Error(`contract ${user.contractId} does not exist.`);
    }

    return UserWithBaseContract.create({
      userId: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      type: user.type,
      base,
      contract,
      status: user.status,
      password: user.password,
    });
  }
}
