import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { MaterialRepository } from "src/domain/material-movimentation/application/repositories/material-repository";
import { Material } from "src/domain/material-movimentation/enterprise/entities/material";

@Injectable()
export class BqMaterialRepository implements MaterialRepository {
  create(Material: Material): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findByCode(code: number, contractId: string): Promise<Material | null> {
    throw new Error("Method not implemented.");
  }
  findMany(
    params: PaginationParams,
    contractId: String,
    type?: string
  ): Promise<Material[]> {
    throw new Error("Method not implemented.");
  }
}
