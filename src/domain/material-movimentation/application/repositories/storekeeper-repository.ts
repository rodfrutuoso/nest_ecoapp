import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Storekeeper } from "../../enterprise/entities/storekeeper";

export interface StorekeeperRepository {
  create(Storekeeper: Storekeeper): Promise<void>;
  delete(StorekeeperId: string): Promise<void>;
  save(torekeeper: Storekeeper): Promise<void>;
  findById(StorekeeperId: string): Promise<Storekeeper | null>;
  findByEmail(email: string): Promise<Storekeeper | null>;
  findMany(params: PaginationParams, baseId?: string): Promise<Storekeeper[]>;
}
