import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Storekeeper } from "../../enterprise/entities/storekeeper";
import { StorekeeperWithBase } from "../../enterprise/entities/value-objects/storekeeper-with-base";

export abstract class StorekeeperRepository {
  abstract create(Storekeeper: Storekeeper): Promise<void>;
  abstract delete(StorekeeperId: string): Promise<void>;
  abstract save(torekeeper: Storekeeper): Promise<void>;
  abstract findById(storekeeperId: string): Promise<Storekeeper | null>;
  abstract findByIds(storekeeperIds: string[]): Promise<Storekeeper[]>;
  abstract findByEmail(email: string): Promise<Storekeeper | null>;
  abstract findMany(
    params: PaginationParams,
    baseId?: string
  ): Promise<Storekeeper[]>;
  abstract findManyWithBase(
    params: PaginationParams,
    baseId?: string,
    name?: string
  ): Promise<StorekeeperWithBase[]>;
}
