import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Base } from "../../enterprise/entities/base";

export abstract class BaseRepository {
  abstract create(Base: Base): Promise<void>;
  abstract findByBaseName(baseName: string): Promise<Base | null>;
  abstract findMany(params: PaginationParams): Promise<Base[]>;
}
