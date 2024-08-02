import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import {
  Storekeeper,
  StorekeeperProps,
} from "../../src/domain/material-movimentation/enterprise/entities/storekeeper";
import { faker } from "@faker-js/faker";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { BqUserMapper } from "src/infra/database/bigquery/mappers/bq-user-mapper";

export function makeStorekeeper(
  override: Partial<StorekeeperProps> = {},
  id?: UniqueEntityID
) {
  const storekeeper = Storekeeper.create(
    {
      name: faker.person.fullName(),
      cpf: faker.number.int({ min: 100000000, max: 10000000000 }).toString(),
      baseId: new UniqueEntityID(),
      email: faker.internet.email({ provider: "ecoeletrica.com.br" }),
      status: faker.helpers.arrayElement(status),
      type: faker.helpers.arrayElement(types),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return storekeeper;
}

@Injectable()
export class StorekeeperFactory {
  constructor(private bigquery: BigQueryService) {}

  async makeBqStorekeeper(
    data: Partial<StorekeeperProps> = {}
  ): Promise<Storekeeper> {
    const storekeeper = makeStorekeeper(data);

    await this.bigquery.user.create([BqUserMapper.toBigquery(storekeeper)]);

    return storekeeper;
  }
}

const status = ["active", "inactive"];
const types = ["Administrador", "Almoxarife"];
