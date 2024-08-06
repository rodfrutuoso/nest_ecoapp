import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Movimentation } from "../../enterprise/entities/movimentation";

export abstract class MovimentationRepository {
  abstract findByProject(
    projectid: string,
    materialId?: string
  ): Promise<Movimentation[]>;
  abstract findManyHistory(
    params: PaginationParams,
    baseId: string,
    storekeeperId?: string,
    projectId?: string,
    materialId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Movimentation[]>;
  abstract create(movimentations: Movimentation[]): Promise<void>;
}
