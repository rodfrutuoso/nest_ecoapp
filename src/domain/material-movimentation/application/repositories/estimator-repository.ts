import { PaginationParams } from "src/core/repositories/pagination-params";
import { Estimator } from "../../enterprise/entities/estimator";
import { EstimatorWithContract } from "../../enterprise/entities/value-objects/estimator-with-contract";

export abstract class EstimatorRepository {
  abstract create(estimator: Estimator): Promise<void>;
  abstract findById(estimatorId: string): Promise<Estimator | null>;
  abstract findByIdWithContract(
    estimatorId: string
  ): Promise<EstimatorWithContract | null>;
  abstract findByIds(estimatorIds: string[]): Promise<Estimator[]>;
  abstract findByEmail(email: string): Promise<Estimator | null>;
  abstract findByEmailOrCpf(
    email: string,
    cpf: string
  ): Promise<Estimator | null>;
  abstract save(estimator: Estimator): Promise<void>;
  abstract delete(estimatorId: string): Promise<void>;
  abstract findManyWithContract(
    params: PaginationParams,
    contractId?: string,
    name?: string
  ): Promise<EstimatorWithContract[]>;
}
