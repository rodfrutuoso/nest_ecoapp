import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import {
  Movimentation,
  MovimentationProps,
} from "../../src/domain/material-movimentation/enterprise/entities/movimentation";
import { faker } from "@faker-js/faker";

export function makeMovimentation(override: Partial<MovimentationProps> = {}) {
  const movimentation = Movimentation.create({
    projectId: new UniqueEntityID(),
    materialId: new UniqueEntityID(),
    storekeeperId: new UniqueEntityID(),
    baseID: new UniqueEntityID(),
    observation: faker.lorem.sentence(),
    value: faker.number.float({ min: -1000, max: 1000 }),
    createdAt: faker.date.recent(),
    ...override,
  });

  return movimentation;
}
