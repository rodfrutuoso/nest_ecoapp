import { Material } from "src/domain/material-movimentation/enterprise/entities/material";
import { BqMaterialProps } from "../schemas/materials";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export class BqMaterialMapper {
  static toDamin(raw: BqMaterialProps): Material {
    return Material.create(
      {
        code: raw.code,
        contractId: new UniqueEntityID(raw.contractId),
        description: raw.description,
        type: raw.type,
        unit: raw.unit,
      },
      new UniqueEntityID(raw.id)
    );
  }
}
