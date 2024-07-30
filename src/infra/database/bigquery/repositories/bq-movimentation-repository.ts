import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { MovimentationRepository } from "src/domain/material-movimentation/application/repositories/movimentation-repository";
import { Movimentation } from "src/domain/material-movimentation/enterprise/entities/movimentation";
import { BigQueryService } from "../bigquery.service";
import { BqMovimentationMapper } from "../mappers/bq-movimentation-mapper";

@Injectable()
export class BqMovimentationRepository implements MovimentationRepository {
  constructor(private bigquery: BigQueryService) {}

  async findByProject(
    projectId: string,
    materialId?: string
  ): Promise<Movimentation[]> {
    const movimentations = await this.bigquery.movimentation.select({
      where: { projectId, materialId },
    });

    const movimentationsMapped = movimentations.map(
      BqMovimentationMapper.toDomin
    );

    return movimentationsMapped;
  }

  async findManyHistory(
    { page }: PaginationParams,
    baseId: string,
    storekeeperId?: string,
    projectId?: string,
    materialId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Movimentation[]> {
    const pageCount = 40;

    const movimentations = await this.bigquery.movimentation.select({
      where: { baseId, userId: storekeeperId, projectId, materialId },
      greaterOrEqualThan: { createdAt: startDate },
      lessOrEqualThan: { createdAt: endDate },
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "materialId", direction: "ASC" },
    });

    return movimentations.map(BqMovimentationMapper.toDomin);
  }

  async create(movimentations: Movimentation[]): Promise<void> {
    const data = movimentations.map(BqMovimentationMapper.toBigquery);

    await this.bigquery.movimentation.create(data);
  }
}
