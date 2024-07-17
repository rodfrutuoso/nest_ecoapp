import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import {
  Base,
  BaseProps,
} from "../../src/domain/material-movimentation/enterprise/entities/base";
import { faker } from "@faker-js/faker";

export function makeBase(override: Partial<BaseProps> = {}) {
  const base = Base.create({
    contractID: new UniqueEntityID(),
    baseName: faker.location.city(),
    ...override,
  });

  return base;
}
