import {
  Contract,
  ContractProps,
} from "../../src/domain/material-movimentation/enterprise/entities/contract";
import { faker } from "@faker-js/faker";

export function makeContract(override: Partial<ContractProps> = {}) {
  const contract = Contract.create({
    contractName: faker.location.city(),
    ...override,
  });

  return contract;
}
