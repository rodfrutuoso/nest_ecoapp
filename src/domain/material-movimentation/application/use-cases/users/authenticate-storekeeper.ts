import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { Encrypter } from "../../cryptography/encrypter";
import { HashComparer } from "../../cryptography/hash-comperer";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { WrogCredentialsError } from "../errors/wrong-credentials";

interface AuthenticateStorekeeperUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStorekeeperResponse = Eihter<
  WrogCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateStorekeeperUseCase {
  constructor(
    private storekeeperRepository: StorekeeperRepository,
    private hashComprarer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStorekeeperUseCaseRequest): Promise<AuthenticateStorekeeperResponse> {
    const storekeeper = await this.storekeeperRepository.findByEmail(email);

    if (!storekeeper) return left(new WrogCredentialsError());

    const isPasswordValid = await this.hashComprarer.compare(
      password,
      storekeeper.password
    );

    const accessToken = await this.encrypter.encrypter({
      sub: storekeeper.id.toString(),
      type: storekeeper.type,
      baseId: storekeeper.baseId,
    });

    if (!isPasswordValid) return left(new WrogCredentialsError());

    return right({ accessToken });
  }
}
