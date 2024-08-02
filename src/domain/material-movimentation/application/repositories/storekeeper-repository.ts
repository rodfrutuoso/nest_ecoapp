import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Storekeeper } from "../../enterprise/entities/storekeeper";

export abstract class StorekeeperRepository {
  abstract create(Storekeeper: Storekeeper): Promise<void>;
  abstract delete(StorekeeperId: string): Promise<void>;
  abstract save(torekeeper: Storekeeper): Promise<void>;
  abstract findById(storekeeperId: string): Promise<Storekeeper | null>;
  abstract findByEmail(email: string): Promise<Storekeeper | null>;
  abstract findMany(
    params: PaginationParams,
    baseId?: string
  ): Promise<Storekeeper[]>;
}
