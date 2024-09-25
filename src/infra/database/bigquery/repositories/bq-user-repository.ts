import { UserRepository } from "src/domain/material-movimentation/application/repositories/user-repository";
import { BigQueryService } from "../bigquery.service";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";
import { UserWithBaseContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/user-with-base-contract";
import { BqUserMapper } from "../mappers/bq-user-mapper";
import { BqUserWithBaseContractMapper } from "../mappers/bq-user-with-base-contract-mapper";

export class BqUserRepository implements UserRepository {
  constructor(private bigquery: BigQueryService) {}
  async create(user: Storekeeper | Estimator): Promise<void> {
    await this.bigquery.user.create([BqUserMapper.toBigquery(user)]);
  }

  async findByIdWithBaseContract(
    userId: string
  ): Promise<UserWithBaseContract | null> {
    const [user] = await this.bigquery.user.select({
      where: { id: userId },
      include: {
        base: {
          join: { table: "base", on: "user.baseId = base.id" },
          relationType: "one-to-one",
        },
        contract: {
          join: { table: "contract", on: "user.contractId = contract.id" },
          relationType: "one-to-one",
        },
      },
    });

    if (!user) return null;

    return BqUserWithBaseContractMapper.toDomainUser(user);
  }

  async findManyWithBaseContract(
    { page }: PaginationParams,
    baseId?: string,
    contractId?: string,
    name?: string
  ): Promise<UserWithBaseContract[]> {
    const pageCount = 40;

    const users = await this.bigquery.user.select({
      where: { baseId, contractId },
      like: { name },
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "cpf", direction: "ASC" },
      include: {
        base: {
          join: { table: "base", on: "user.baseId = base.id" },
          relationType: "one-to-one",
        },
        contract: {
          join: { table: "contract", on: "user.contractId = contract.id" },
          relationType: "one-to-one",
        },
      },
    });

    return users.map(BqUserWithBaseContractMapper.toDomainUser);
  }

  async findByIds(userIds: string[]): Promise<Array<Storekeeper | Estimator>> {
    const users = await this.bigquery.user.select({
      whereIn: { id: userIds },
    });

    return users.map(BqUserMapper.toDomain);
  }

  async save(user: Storekeeper | Estimator): Promise<void> {
    await this.bigquery.user.update({
      data: BqUserMapper.toBigquery(user),
      where: { id: user.id.toString() },
    });
  }
}
