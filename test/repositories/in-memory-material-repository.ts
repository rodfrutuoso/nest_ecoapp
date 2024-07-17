import { PaginationParams } from "../../src/core/repositories/pagination-params";
import { MaterialRepository } from "../../src/domain/material-movimentation/application/repositories/material-repository";
import { Material } from "../../src/domain/material-movimentation/enterprise/entities/material";

export class InMemoryMaterialRepository implements MaterialRepository {
  public items: Material[] = [];

  async findByCode(code: number, contractId: string): Promise<Material | null> {
    const material = this.items.find(
      (item) => item.code === code && item.contractId.toString() === contractId
    );

    if (!material) return null;

    return material;
  }

  async create(material: Material) {
    this.items.push(material);
  }

  async findMany(
    { page }: PaginationParams,
    contractId: string,
    type?: string
  ): Promise<Material[]> {
    const materials = this.items
      .filter(
        (material) =>
          !contractId || material.contractId.toString() === contractId
      )
      .filter((material) => !type || material.type === type)
      .sort((a, b) => a.code - b.code)
      .slice((page - 1) * 40, page * 40);

    return materials;
  }
}
