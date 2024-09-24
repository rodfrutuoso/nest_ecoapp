import { EstimatorWithContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/estimator-with-contract";
import { EstimatorRepository } from "../../src/domain/material-movimentation/application/repositories/estimator-repository";
import { Estimator } from "../../src/domain/material-movimentation/enterprise/entities/estimator";
import { InMemoryContractRepository } from "./in-memory-contract-repository";
import { PaginationParams } from "src/core/repositories/pagination-params";

export class InMemoryEstimatorRepository implements EstimatorRepository {
  public items: Estimator[] = [];

  constructor(private contractRepository: InMemoryContractRepository) {}

  async create(estimator: Estimator) {
    this.items.push(estimator);
  }

  async findById(id: string): Promise<Estimator | null> {
    const estimator = this.items.find((item) => item.id.toString() === id);

    if (!estimator) return null;

    return estimator;
  }

  async findByIdWithContract(
    id: string
  ): Promise<EstimatorWithContract | null> {
    const estimator = this.items.find((item) => item.id.toString() === id);
    if (!estimator) return null;

    const contract = this.contractRepository.items.find(
      (contract) => contract.id === estimator.contractId
    );

    if (!contract) {
      throw new Error(`contract ${estimator.contractId} does not exist.`);
    }

    return EstimatorWithContract.create({
      estimatorId: estimator.id,
      name: estimator.name,
      email: estimator.email,
      cpf: estimator.cpf,
      type: estimator.type,
      contract: contract,
      status: estimator.status,
      password: estimator.password,
    });
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

  async save(estimator: Estimator) {
    const itemIndex = this.items.findIndex((item) => item.id == estimator.id);

    this.items[itemIndex] = estimator;
  }

  async delete(estimatorId: string) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() == estimatorId
    );

    this.items.splice(itemIndex, 1);
  }

  async findManyWithContract(
    { page }: PaginationParams,
    contractId?: string,
    name?: string
  ): Promise<EstimatorWithContract[]> {
    const estimators = this.items
      .filter(
        (estimator) =>
          !contractId || estimator.contractId.toString() === contractId
      )
      .filter((estimator) => !name || estimator.name.includes(name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice((page - 1) * 40, page * 40)
      .map((estimator) => {
        const contract = this.contractRepository.items.find(
          (contract) => contract.id === estimator.contractId
        );

        if (!contract) {
          throw new Error(`contract ${estimator.contractId} does not exist.`);
        }

        return EstimatorWithContract.create({
          estimatorId: estimator.id,
          name: estimator.name,
          email: estimator.email,
          cpf: estimator.cpf,
          type: estimator.type,
          contract: contract,
          status: estimator.status,
          password: estimator.password,
        });
      });

    return estimators;
  }
}
