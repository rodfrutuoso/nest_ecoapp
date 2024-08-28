import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { BaseRepository } from "src/domain/material-movimentation/application/repositories/base-repository";
import { Base } from "src/domain/material-movimentation/enterprise/entities/base";
import { BqBaseMapper } from "../mappers/bq-base-mapper";
import { BigQueryService } from "../bigquery.service";
import { BqBaseWithContractMapper } from "../mappers/bq-base-with-contract-mapper";
import { BaseWithContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/base-with-contract";

@Injectable()
export class BqBaseRepository implements BaseRepository {
  constructor(private bigquery: BigQueryService) {}

  async create(base: Base): Promise<void> {
    const data = BqBaseMapper.toBigquery(base);

    await this.bigquery.base.create([data]);
  }

  async findByBaseName(baseName: string): Promise<Base | null> {
    const [base] = await this.bigquery.base.select({
      where: { baseName },
    });

    if (!base) return null;

    return BqBaseMapper.toDomin(base);
  }

  async findById(baseId: string): Promise<Base | null> {
    const [base] = await this.bigquery.base.select({
      where: { id: baseId },
    });

    if (!base) return null;

    return BqBaseMapper.toDomin(base);
  }

  async findMany({ page }: PaginationParams): Promise<Base[]> {
    const pageCount = 40;

    const bases = await this.bigquery.base.select({
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "baseName", direction: "ASC" },
    });

    return bases.map(BqBaseMapper.toDomin);
  }

  async findManyWithContract({
    page,
  }: PaginationParams): Promise<BaseWithContract[]> {
    const pageCount = 40;

    const bases = await this.bigquery.base.select({
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "baseName", direction: "ASC" },
      include: {
        contract: {
          join: { table: "contract", on: "base.contractId = contract.id" },
          relationType: "one-to-one",
        },
      },
    });

    return bases.map(BqBaseWithContractMapper.toDomin);
  }
}
