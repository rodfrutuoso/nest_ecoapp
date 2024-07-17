import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { Movimentation } from "../../../enterprise/entities/movimentation";
import { MovimentationRepository } from "../../repositories/movimentation-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface TransferMovimentationBetweenProjectsUseCaseRequest {
  storekeeperId: string;
  materialId: string;
  projectIdOut: string;
  projectIdIn: string;
  observation: string;
  baseID: string;
  value: number;
}

type TransferMovimentationBetweenProjectsResponse = Eihter<
  ResourceNotFoundError,
  {
    movimentationIn: Movimentation;
    movimentationOut: Movimentation;
  }
>;

export class TransferMovimentationBetweenProjectsUseCase {
  constructor(private movimentationRepository: MovimentationRepository) {}

  async execute({
    storekeeperId,
    materialId,
    projectIdOut,
    projectIdIn,
    observation,
    baseID,
    value,
  }: TransferMovimentationBetweenProjectsUseCaseRequest): Promise<TransferMovimentationBetweenProjectsResponse> {
    const movimentationVerificationOut =
      await this.movimentationRepository.findByProject(
        projectIdOut,
        materialId
      );

    if (
      !movimentationVerificationOut ||
      movimentationVerificationOut[0].value < value
    )
      return left(new ResourceNotFoundError());

    const movimentationOut = Movimentation.create({
      projectId: new UniqueEntityID(projectIdOut),
      materialId: new UniqueEntityID(materialId),
      storekeeperId: new UniqueEntityID(storekeeperId),
      observation,
      baseID: new UniqueEntityID(baseID),
      value: -Math.abs(value),
    });

    await this.movimentationRepository.create(movimentationOut);

    const movimentationIn = Movimentation.create({
      projectId: new UniqueEntityID(projectIdIn),
      materialId: new UniqueEntityID(materialId),
      storekeeperId: new UniqueEntityID(storekeeperId),
      observation,
      baseID: new UniqueEntityID(baseID),
      value: Math.abs(value),
    });

    await this.movimentationRepository.create(movimentationIn);

    return right({ movimentationIn, movimentationOut });
  }
}
