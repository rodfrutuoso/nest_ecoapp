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

  async findByIds(ids: string[]): Promise<Estimator[]> {
    const estimator = this.items.filter((item) =>
      ids.includes(item.id.toString())
    );

    return estimator;
  }

  async findByEmail(email: string): Promise<Estimator | null> {
    const estimator = this.items.find((item) => item.email === email);

    if (!estimator) return null;

    return estimator;
  }

  async findByEmailOrCpf(
    email: string,
    cpf: string
  ): Promise<Estimator | null> {
    const estimator = this.items.find(
      (item) => item.email.toString() === email || item.cpf === cpf
    );

    if (!estimator) return null;

    return estimator;
  }
}
