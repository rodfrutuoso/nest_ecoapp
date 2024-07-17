import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import {
  Storekeeper,
  StorekeeperProps,
} from "../../src/domain/material-movimentation/enterprise/entities/storekeeper";
import { faker } from "@faker-js/faker";

export function makeStorekeeper(override: Partial<StorekeeperProps> = {}) {
  const storekeeper = Storekeeper.create({
    name: faker.person.fullName(),
    cpf: faker.number.int({ min: 100000000, max: 10000000000 }).toString(),
    baseId: new UniqueEntityID(),
    email: faker.internet.email({ provider: "ecoeletrica.com.br" }),
    status: faker.helpers.arrayElement(status),
    type: faker.helpers.arrayElement(types),
    ...override,
  });

  return storekeeper;
}

const status = ["active", "inactive"];
const types = ["Administrador", "Almoxarife"];
