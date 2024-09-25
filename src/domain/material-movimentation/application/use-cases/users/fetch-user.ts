import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { UserRepository } from "../../repositories/user-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UserWithBaseContract } from "src/domain/material-movimentation/enterprise/entities/value-objects/user-with-base-contract";

interface FetchUserUseCaseRequest {
  page: number;
  baseId?: string;
  contractId?: string;
  name?: string;
}

type FetchUserUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    users: UserWithBaseContract[];
  }
>;

@Injectable()
export class FetchUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    page,
    baseId,
    contractId,
    name,
  }: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse> {
    const users = await this.userRepository.findManyWithBaseContract(
      {
        page,
      },
      baseId,
      contractId,
      name
    );

    if (!users.length) return left(new ResourceNotFoundError());

    return right({ users });
  }
}
