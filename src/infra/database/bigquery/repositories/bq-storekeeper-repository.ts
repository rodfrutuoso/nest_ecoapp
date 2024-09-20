import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { StorekeeperRepository } from "src/domain/material-movimentation/application/repositories/storekeeper-repository";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";
import { BigQueryService } from "../bigquery.service";
import { BqUserMapper } from "../mappers/bq-user-mapper";
import { StorekeeperWithBase } from "src/domain/material-movimentation/enterprise/entities/value-objects/storekeeper-with-base";
import { BqUserWithBaseContractMapper } from "../mappers/bq-user-with-base-contract-mapper";

@Injectable()
export class BqStorekeeperRepository implements StorekeeperRepository {
  constructor(private bigquery: BigQueryService) {}

  async create(Storekeeper: Storekeeper): Promise<void> {
    await this.bigquery.user.create([BqUserMapper.toBigquery(Storekeeper)]);
  }

  async delete(StorekeeperId: string): Promise<void> {
    await this.bigquery.user.delete({ id: StorekeeperId });
  }

  async save(storekeeper: Storekeeper): Promise<void> {
    await this.bigquery.user.update({
      data: BqUserMapper.toBigquery(storekeeper),
      where: { id: storekeeper.id.toString() },
    });
  }

  async findById(storekeeperId: string): Promise<Storekeeper | null> {
    const [storekeeper] = await this.bigquery.user.select({
      where: { id: storekeeperId },
    });

    if (!storekeeper) return null;

    const result = BqUserMapper.toDomin(storekeeper);
    return result instanceof Storekeeper ? result : null;
  }

  async findByIdWithBase(
    storekeeperId: string
  ): Promise<StorekeeperWithBase | null> {
    const [storekeeper] = await this.bigquery.user.select({
      where: { id: storekeeperId },
      include: {
        base: {
          join: { table: "base", on: "user.baseId = base.id" },
          relationType: "one-to-one",
        },
      },
    });

    if (!storekeeper) return null;

    const result = BqUserWithBaseContractMapper.toDomin(storekeeper);
    return result instanceof StorekeeperWithBase ? result : null;
  }

  async findByIds(storekeeperIds: string[]): Promise<Storekeeper[]> {
    const storekeepers = await this.bigquery.user.select({
      whereIn: { id: storekeeperIds },
    });

    return storekeepers
      .map(BqUserMapper.toDomin)
      .filter((storekeeper) => storekeeper instanceof Storekeeper);
  }

  async findByEmail(email: string): Promise<Storekeeper | null> {
    const [storekeeper] = await this.bigquery.user.select({
      where: { email },
    });

    if (!storekeeper) return null;

    const result = BqUserMapper.toDomin(storekeeper);

    return result instanceof Storekeeper ? result : null;
  }

  async findByEmailOrCpf(
    email: string,
    cpf: string
  ): Promise<Storekeeper | null> {
    const [storekeeper] = await this.bigquery.user.select({
      where: { OR: [{ email }, { cpf }] },
    });

    if (!storekeeper) return null;

    const result = BqUserMapper.toDomin(storekeeper);

    return result instanceof Storekeeper ? result : null;
  }

  async findMany(
    { page }: PaginationParams,
    baseId?: string
  ): Promise<Storekeeper[]> {
    const pageCount = 40;

    const storekeepers = await this.bigquery.user.select({
      where: { baseId },
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "cpf", direction: "ASC" },
    });

    const storekeepersDomain = storekeepers.map(BqUserMapper.toDomin);
    const result = storekeepersDomain.filter(
      (storekeeper) => storekeeper instanceof Storekeeper
    );

    return result;
  }

  async findManyWithBase(
    { page }: PaginationParams,
    baseId?: string,
    name?: string
  ): Promise<StorekeeperWithBase[]> {
    const pageCount = 40;

    const storekeepers = await this.bigquery.user.select({
      where: { baseId },
      like: { name },
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "cpf", direction: "ASC" },
      include: {
        base: {
          join: { table: "base", on: "user.baseId = base.id" },
          relationType: "one-to-one",
        },
      },
    });

    const storekeepersDomain = storekeepers.map(
      BqUserWithBaseContractMapper.toDomin
    );
    const result = storekeepersDomain.filter(
      (storekeeper) => storekeeper instanceof StorekeeperWithBase
    );

    return result;
  }
}
