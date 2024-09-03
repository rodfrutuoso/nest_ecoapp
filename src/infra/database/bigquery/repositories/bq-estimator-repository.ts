import { Injectable } from "@nestjs/common";
import { EstimatorRepository } from "src/domain/material-movimentation/application/repositories/estimator-repository";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { BqUserMapper } from "../mappers/bq-user-mapper";

@Injectable()
export class BqEstimatorRepository implements EstimatorRepository {
  bigquery: any;
  async findById(estimatorId: string): Promise<Estimator | null> {
    const [estimator] = await this.bigquery.user.select({
      where: { id: estimatorId },
    });

    if (!estimator) return null;

    const result = BqUserMapper.toDomin(estimator);
    return result instanceof Estimator ? result : null;
  }

  async findByEmail(email: string): Promise<Estimator | null> {
    const [estimator] = await this.bigquery.user.select({
      where: { email },
    });

    if (!estimator) return null;

    const result = BqUserMapper.toDomin(estimator);

    return result instanceof Estimator ? result : null;
  }
}
