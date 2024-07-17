import { Eihter, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { Movimentation } from "../../../enterprise/entities/movimentation";
import { MovimentationRepository } from "../../repositories/movimentation-repository";

interface TransferMaterialUseCaseRequest {
  storekeeperId: string;
  materialId: string;
  projectId: string;
  observation: string;
  baseID: string;
  value: number;
}

type TransferMaterialResponse = Eihter<
  null,
  {
    movimentation: Movimentation;
  }
>;

export class TransferMaterialUseCase {
  constructor(private movimentationRepository: MovimentationRepository) {}

  async execute({
    storekeeperId,
    materialId,
    projectId,
    observation,
    baseID,
    value,
  }: TransferMaterialUseCaseRequest): Promise<TransferMaterialResponse> {
    const movimentation = Movimentation.create({
      projectId: new UniqueEntityID(projectId),
      materialId: new UniqueEntityID(materialId),
      storekeeperId: new UniqueEntityID(storekeeperId),
      observation,
      baseID: new UniqueEntityID(baseID),
      value,
    });

    await this.movimentationRepository.create(movimentation);

    return right({ movimentation });
  }
}
