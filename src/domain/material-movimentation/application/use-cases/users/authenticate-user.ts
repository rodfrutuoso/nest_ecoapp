import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { Encrypter } from "../../cryptography/encrypter";
import { HashComparer } from "../../cryptography/hash-comperer";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { WrogCredentialsError } from "../errors/wrong-credentials";
import { EstimatorRepository } from "../../repositories/estimator-repository";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";
import { Estimator } from "src/domain/material-movimentation/enterprise/entities/estimator";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserResponse = Eihter<
  WrogCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private storekeeperRepository: StorekeeperRepository,
    private estimatorRepository: EstimatorRepository,
    private hashComprarer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserResponse> {
    const user = await this.SearchOnAllEntities(email);

    if (!user) return left(new WrogCredentialsError());

    const isPasswordValid = await this.hashComprarer.compare(
      password,
      user.password
    );

    if (!isPasswordValid) return left(new WrogCredentialsError());

    const accessToken = await this.encrypter.encrypter({
      sub: user.id.toString(),
      type: user.type,
      ...(user instanceof Storekeeper ? { baseId: user.baseId.toString() } : {}),
      ...(user instanceof Estimator ? { contractId: user.contractId.toString() } : {}),
    });

    return right({ accessToken });
  }

  private async SearchOnAllEntities(email) {
    const storekeeper = await this.storekeeperRepository.findByEmail(email);
    if (storekeeper) return storekeeper;

    const estimator = await this.estimatorRepository.findByEmail(email);
    if (estimator) return estimator;

    return null;
  }
}
