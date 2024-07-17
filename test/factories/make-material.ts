import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import {
  Material,
  MaterialProps,
} from "../../src/domain/material-movimentation/enterprise/entities/material";
import { faker } from "@faker-js/faker";

export function makeMaterial(override: Partial<MaterialProps> = {}) {
  const material = Material.create({
    code: faker.number.int({ min: 10000, max: 999999 }),
    description: faker.number
      .int({ min: 100000000, max: 10000000000 })
      .toString(),
    unit: faker.helpers.arrayElement(unit),
    type: faker.helpers.arrayElement(types),
    contractId: new UniqueEntityID,
    ...override,
  });

  return material;
}

const unit = ["CDA", "UN", "M", "KG"];
const types = ["CONCRETO", "FERRAGEM"];
