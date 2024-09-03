import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "../../src/core/entities/unique-entity-id";
import {
  Estimator,
  EstimatorProps,
} from "../../src/domain/material-movimentation/enterprise/entities/estimator";
import { faker } from "@faker-js/faker";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { BqUserMapper } from "src/infra/database/bigquery/mappers/bq-user-mapper";

export function makeEstimator(
  override: Partial<EstimatorProps> = {},
  id?: UniqueEntityID
) {
  const estimator = Estimator.create(
    {
      name: faker.person.firstName(),
      cpf: faker.number.int({ min: 100000000, max: 10000000000 }).toString(),
      contractId: new UniqueEntityID(),
      email: faker.internet.email({ provider: "ecoeletrica.com.br" }),
      status: faker.helpers.arrayElement(status),
      type: faker.helpers.arrayElement(types),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return estimator;
}

@Injectable()
export class EstimatorFactory {
  constructor(private bigquery: BigQueryService) {}

  async makeBqEstimator(
    data: Partial<EstimatorProps> = {}
  ): Promise<Estimator> {
    const estimator = makeEstimator(data);

    await this.bigquery.user.create([BqUserMapper.toBigquery(estimator)]);

    return estimator;
  }
}

const status = ["active", "inactive"];
const types = ["Administrador", "Almoxarife"];
