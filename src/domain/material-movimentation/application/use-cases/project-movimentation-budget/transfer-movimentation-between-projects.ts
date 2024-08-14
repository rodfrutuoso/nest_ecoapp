import { Injectable } from "@nestjs/common";
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
  baseId: string;
  value: number;
}

type TransferMovimentationBetweenProjectsResponse = Eihter<
  ResourceNotFoundError,
  {
    movimentationIn: Movimentation[];
    movimentationOut: Movimentation[];
  }
>;

@Injectable()
export class TransferMovimentationBetweenProjectsUseCase {
  constructor(private movimentationRepository: MovimentationRepository) {}

  async execute(
    transferMovimentationBetweenProjectsUseCaseRequest: TransferMovimentationBetweenProjectsUseCaseRequest[]
  ): Promise<TransferMovimentationBetweenProjectsResponse> {
    let movimentationIn: Movimentation[] = [];
    let movimentationOut: Movimentation[] = [];
    let movimentationVerificationOut: Movimentation[] = [];
    let countErrors = 0;

    //create array with unique values os projectsId
    const projectsId = [
      ...new Set(
        transferMovimentationBetweenProjectsUseCaseRequest.map(
          (transfer) => transfer.projectIdOut
        )
      ),
    ];

    // searh all movimentation of the informed projects and insert on movimentationRepository
    for (const project of projectsId) {
      const movimentationProject =
        await this.movimentationRepository.findByProject(project);
      movimentationVerificationOut =
        movimentationVerificationOut.concat(movimentationProject);
    }

    // verify if in any case of transference there're enough materials in the origin project
    transferMovimentationBetweenProjectsUseCaseRequest.forEach((request) => {
      const valueSumRepository = movimentationVerificationOut
        .filter(
          (movRepo) =>
            movRepo.projectId.toString() === request.projectIdOut &&
            movRepo.materialId.toString() === request.materialId
        )
        .reduce((a, b) => a + b.value, 0);

      if (valueSumRepository < request.value) countErrors += 1;
    });

    // counter of cases that there're enough materials in the origin project
    if (countErrors > 0) return left(new ResourceNotFoundError());

    transferMovimentationBetweenProjectsUseCaseRequest.map(async (transfer) => {
      movimentationOut.push(
        Movimentation.create({
          projectId: new UniqueEntityID(transfer.projectIdOut),
          materialId: new UniqueEntityID(transfer.materialId),
          storekeeperId: new UniqueEntityID(transfer.storekeeperId),
          observation: transfer.observation,
          baseId: new UniqueEntityID(transfer.baseId),
          value: -Math.abs(transfer.value),
        })
      );

      movimentationIn.push(
        Movimentation.create({
          projectId: new UniqueEntityID(transfer.projectIdIn),
          materialId: new UniqueEntityID(transfer.materialId),
          storekeeperId: new UniqueEntityID(transfer.storekeeperId),
          observation: transfer.observation,
          baseId: new UniqueEntityID(transfer.baseId),
          value: Math.abs(transfer.value),
        })
      );
    });

    const concatMovimentations = movimentationOut.concat(movimentationIn);

    await this.movimentationRepository.create(concatMovimentations);

    return right({ movimentationIn, movimentationOut });
  }
}
