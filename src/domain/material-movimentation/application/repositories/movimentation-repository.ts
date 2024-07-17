import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Movimentation } from "../../enterprise/entities/movimentation";

export interface MovimentationRepository {
  findByProject(
    projectid: string,
    materialId?: string
  ): Promise<Movimentation[]>;
  findManyHistory(
    params: PaginationParams,
    baseID: string,
    storekeeperId?: string,
    projectId?: string,
    materialId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Movimentation[]>;
  create(movimentation: Movimentation): Promise<void>;
}
