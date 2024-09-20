import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";
import { EstimatorRepository } from "../../repositories/estimator-repository";

interface VerifyUserInformationsUseCaseRequest {
  email: string;
  cpf: string;
}

type VerifyUserInformationsResponse = Eihter<
  ResourceAlreadyRegisteredError,
  true
>;

@Injectable()
export class VerifyUserInformationsUseCase {
  constructor(
    private storekeeperRepository: StorekeeperRepository,
    private estimatorRepository: EstimatorRepository
  ) {}

  async execute({
    email,
    cpf,
  }: VerifyUserInformationsUseCaseRequest): Promise<VerifyUserInformationsResponse> {
    const user = await this.SearchEmailCpfOnAllEntities(email, cpf);

    if (user) return left(new ResourceAlreadyRegisteredError());

    return right(true);
  }

  private async SearchEmailCpfOnAllEntities(email, cpf) {
    const storekeeper = await this.storekeeperRepository.findByEmailOrCpf(
      email,
      cpf
    );
    if (storekeeper) return storekeeper;

    const estimator = await this.estimatorRepository.findByEmailOrCpf(
      email,
      cpf
    );
    if (estimator) return estimator;

    return null;
  }
}
