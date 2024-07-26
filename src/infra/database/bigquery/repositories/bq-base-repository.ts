import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { BaseRepository } from "src/domain/material-movimentation/application/repositories/base-repository";
import { Base } from "src/domain/material-movimentation/enterprise/entities/base";
import { BqBaseMapper } from "../mappers/bq-base-mapper";
import { BigQueryService } from "../bigquery.service";

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

  async findMany({ page }: PaginationParams): Promise<Base[]> {
    const pageCount = 40;

    const bases = await this.bigquery.base.select({
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "baseName", direction: "ASC" },
    });

    return bases.map(BqBaseMapper.toDomin);
  }
}
