import { Injectable } from "@nestjs/common";
import { EstimatorRepository } from "src/domain/material-movimentation/application/repositories/estimator-repository";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";
import { BqUserMapper } from "../mappers/bq-user-mapper";
import { BigQueryService } from "../bigquery.service";
import { EstimatorWithContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/estimator-with-contract";
import { BqUserWithBaseContractMapper } from "../mappers/bq-user-with-base-contract-mapper";
import { PaginationParams } from "src/core/repositories/pagination-params";

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

  async findByIdWithContract(
    estimatorId: string
  ): Promise<EstimatorWithContract | null> {
    const [estimator] = await this.bigquery.user.select({
      where: { id: estimatorId },
      include: {
        contract: {
          join: { table: "contract", on: "user.contractId = contract.id" },
          relationType: "many-to-one",
        },
      },
    });

    if (!estimator) return null;

    const result = BqUserWithBaseContractMapper.toDomin(estimator);
    return result instanceof EstimatorWithContract ? result : null;
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

  async findByEmailOrCpf(
    email: string,
    cpf: string
  ): Promise<Estimator | null> {
    const [estimator] = await this.bigquery.user.select({
      where: { OR: [{ email }, { cpf }] },
    });

    if (!estimator) return null;

    const result = BqUserMapper.toDomin(estimator);

    return result instanceof Estimator ? result : null;
  }

  async save(estimator: Estimator): Promise<void> {
    await this.bigquery.user.update({
      data: BqUserMapper.toBigquery(estimator),
      where: { id: estimator.id.toString() },
    });
  }

  async delete(estimatorId: string): Promise<void> {
    await this.bigquery.user.delete({ id: estimatorId });
  }

  async findManyWithContract(
    { page }: PaginationParams,
    contractId?: string,
    name?: string
  ): Promise<EstimatorWithContract[]> {
    const pageCount = 40;

    const storekeepers = await this.bigquery.user.select({
      where: { contractId },
      like: { name },
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "cpf", direction: "ASC" },
      include: {
        contract: {
          join: { table: "contract", on: "user.contractId = contract.id" },
          relationType: "one-to-one",
        },
      },
    });

    const storekeepersDomain = storekeepers.map(
      BqUserWithBaseContractMapper.toDomin
    );
    const result = storekeepersDomain.filter(
      (storekeeper) => storekeeper instanceof EstimatorWithContract
    );

    return result;
  }
}
