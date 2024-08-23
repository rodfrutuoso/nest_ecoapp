import { EstimatorRepository } from "../../src/domain/material-movimentation/application/repositories/estimator-repository";
import { Estimator } from "../../src/domain/material-movimentation/enterprise/entities/estimator";

export class InMemoryEstimatorRepository implements EstimatorRepository {
  public items: Estimator[] = [];

  async create(estimator: Estimator) {
    this.items.push(estimator);
  }
}
