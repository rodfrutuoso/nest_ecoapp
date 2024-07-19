import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Material } from "../../enterprise/entities/material";

export abstract class MaterialRepository {
  abstract create(Material: Material): Promise<void>;
  abstract findByCode(
    code: number,
    contractId: string
  ): Promise<Material | null>;
  abstract findMany(
    params: PaginationParams,
    contractId: string,
    type?: string
  ): Promise<Material[]>;
}
