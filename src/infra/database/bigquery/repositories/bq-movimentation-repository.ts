import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { MovimentationRepository } from "src/domain/material-movimentation/application/repositories/movimentation-repository";
import { Movimentation } from "src/domain/material-movimentation/enterprise/entities/movimentation";

@Injectable()
export class BqMovimentationRepository implements MovimentationRepository {
  findByProject(
    projectid: string,
    materialId?: string
  ): Promise<Movimentation[]> {
    throw new Error("Method not implemented.");
  }
  findManyHistory(
    params: PaginationParams,
    baseID: string,
    storekeeperId?: string,
    projectId?: string,
    materialId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Movimentation[]> {
    throw new Error("Method not implemented.");
  }
  create(movimentation: Movimentation): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
