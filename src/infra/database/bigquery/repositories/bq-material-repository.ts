import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { MaterialRepository } from "src/domain/material-movimentation/application/repositories/material-repository";
import { Material } from "src/domain/material-movimentation/enterprise/entities/material";
import { BigQueryService } from "../bigquery.service";
import { BqMaterialMapper } from "../mappers/bq-material-mapper";

@Injectable()
export class BqMaterialRepository implements MaterialRepository {
  constructor(private bigquery: BigQueryService) {}

  async create(Material: Material): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async findByCode(code: number, contractId: string): Promise<Material | null> {
    const [material] = await this.bigquery.material.select({ where: { code } });

    if (!material) return null;

    return BqMaterialMapper.toDamin(material);
  }
  async findMany(
    params: PaginationParams,
    contractId: String,
    type?: string
  ): Promise<Material[]> {
    throw new Error("Method not implemented.");
  }
}
