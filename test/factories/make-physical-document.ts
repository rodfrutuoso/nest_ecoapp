import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import {
  PhysicalDocument,
  PhysicalDocumentProps,
} from "../../src/domain/material-movimentation/enterprise/entities/physical-document";
import { faker } from "@faker-js/faker";

export function makePhysicalDocument(
  override: Partial<PhysicalDocumentProps> = {}
) {
  const physicaldocument = PhysicalDocument.create({
    projectId: new UniqueEntityID(),
    identifier: faker.number.int({ min: 1, max: 420 }),
    unitized: faker.datatype.boolean(),
    ...override,
  });

  return physicaldocument;
}
