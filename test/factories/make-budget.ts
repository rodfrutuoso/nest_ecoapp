import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import {
  Budget,
  BudgetProps,
} from "../../src/domain/material-movimentation/enterprise/entities/budget";
import { faker } from "@faker-js/faker";

export function makeBudget(override: Partial<BudgetProps> = {}) {
  const budget = Budget.create({
    projectId: new UniqueEntityID(),
    materialId: new UniqueEntityID(),
    estimatorId: new UniqueEntityID(),
    contract: new UniqueEntityID(),
    value: faker.number.float({ min: -1000, max: 1000 }),
    createdAt: faker.date.recent(),
    ...override,
  });

  return budget;
}
