import { EstimatorRepository } from "../../src/domain/material-movimentation/application/repositories/estimator-repository";
import { Estimator } from "../../src/domain/material-movimentation/enterprise/entities/estimator";

export class InMemoryEstimatorRepository implements EstimatorRepository {
  public items: Estimator[] = [];

  async create(estimator: Estimator) {
    this.items.push(estimator);
  }

  async findById(id: string): Promise<Estimator | null> {
    const estimator = this.items.find((item) => item.id.toString() === id);

    if (!estimator) return null;

    return estimator;
  }
}
