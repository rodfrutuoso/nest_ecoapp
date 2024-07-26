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
    projectid: string,
    materialId?: string
  ): Promise<Movimentation[]> {
    throw new Error("Method not implemented.");
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

    const baseSearch = `baseId = '${baseId} '`;
    const userSearch = storekeeperId === undefined ? `` : `userId`

    const query =
      "SELECT * FROM `movimentation.movimentation` where " +
      baseSearch +
      " and userId = '' and projectId = '' and materialId = '' and createdAt > '2024-05-04' and createdAt < '2024-06-04' order by createdAt desc limit 40 offset 0 ";

    const movimentations = await this.bigquery.movimentation.runQuery(query);
    // .select({
    //   where: { baseId, userId: storekeeperId, projectId, materialId, },
    //   limit: pageCount,
    //   offset: pageCount * (page - 1),
    //   orderBy: { column: "materialId", direction: "ASC" },
    // });

    return movimentations.map(BqMovimentationMapper.toDomin);
  }

  async create(movimentation: Movimentation): Promise<void> {
    const data = BqMovimentationMapper.toBigquery(movimentation);

    await this.bigquery.movimentation.create([data]);
  }
}
