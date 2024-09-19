import { Injectable } from "@nestjs/common";
import { EstimatorRepository } from "src/domain/material-movimentation/application/repositories/estimator-repository";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { BqUserMapper } from "../mappers/bq-user-mapper";
import { BigQueryService } from "../bigquery.service";

@Injectable()
export class BqEstimatorRepository implements EstimatorRepository {
  constructor(private bigquery: BigQueryService) {}

  async create(estimator: Estimator): Promise<void> {
    await this.bigquery.user.create([BqUserMapper.toBigquery(estimator)]);
  }

  async findById(estimatorId: string): Promise<Estimator | null> {
    const [estimator] = await this.bigquery.user.select({
      where: { id: estimatorId },
    });

    if (!estimator) return null;

    const result = BqUserMapper.toDomin(estimator);
    return result instanceof Estimator ? result : null;
  }

  async findByIds(estimatorIds: string[]): Promise<Estimator[]> {
    const estimators = await this.bigquery.user.select({
      whereIn: { id: estimatorIds },
    });

    return estimators
      .map(BqUserMapper.toDomin)
      .filter((estimator) => estimator instanceof Estimator);
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
