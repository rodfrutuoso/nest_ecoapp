import { Estimator } from "../../enterprise/entities/estimator";

export abstract class EstimatorRepository {
  abstract create(estimator: Estimator): Promise<void>;
  abstract findById(storekeeperId: string): Promise<Estimator | null>;
  abstract findByIds(storekeeperIds: string[]): Promise<Estimator[]>;
  abstract findByEmail(email: string): Promise<Estimator | null>;
  abstract findByEmailOrCpf(
    email: string,
    cpf: string
  ): Promise<Estimator | null>;
}
