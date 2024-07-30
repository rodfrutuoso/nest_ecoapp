import { Eihter, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { Movimentation } from "../../../enterprise/entities/movimentation";
import { MovimentationRepository } from "../../repositories/movimentation-repository";

interface TransferMaterialUseCaseRequest {
  storekeeperId: string;
  materialId: string;
  projectId: string;
  observation: string;
  baseId: string;
  value: number;
}

type TransferMaterialResponse = Eihter<
  null,
  {
    movimentations: Movimentation[];
  }
>;

export class TransferMaterialUseCase {
  constructor(private movimentationRepository: MovimentationRepository) {}

  async execute(
    transferMaterialUseCaseRequest: TransferMaterialUseCaseRequest[]
  ): Promise<TransferMaterialResponse> {
    const movimentations = transferMaterialUseCaseRequest.map(
      (movimentation) => {
        return Movimentation.create({
          projectId: new UniqueEntityID(movimentation.projectId),
          materialId: new UniqueEntityID(movimentation.materialId),
          storekeeperId: new UniqueEntityID(movimentation.storekeeperId),
          observation: movimentation.observation,
          baseId: new UniqueEntityID(movimentation.baseId),
          value: movimentation.value,
        });
      }
    );

    await this.movimentationRepository.create(movimentations);

    return right({ movimentations });
  }
}
