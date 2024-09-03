import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { MovimentationRepository } from "../../repositories/movimentation-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { MovimentationWithDetails } from "src/domain/material-movimentation/enterprise/entities/value-objects/movimentation-with-details";
import { ProjectRepository } from "../../repositories/project-repository";
import { StorekeeperRepository } from "../../repositories/storekeeper-repository";
import { MaterialRepository } from "../../repositories/material-repository";
import { BaseRepository } from "../../repositories/base-repository";

interface FetchMovimentationHistoryUseCaseRequest {
  page: number;
  baseId: string;
  email?: string;
  project_number?: string;
  material_code?: number;
  startDate?: Date;
  endDate?: Date;
}

type FetchMovimentationHistoryUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    movimentations: MovimentationWithDetails[];
  }
>;

@Injectable()
export class FetchMovimentationHistoryUseCase {
  constructor(
    private movimentationRepository: MovimentationRepository,
    private projectRepository: ProjectRepository,
    private storekeeperRepository: StorekeeperRepository,
    private materialRepository: MaterialRepository,
    private baseRepository: BaseRepository
  ) {}

  async execute({
    page,
    baseId,
    email,
    project_number,
    material_code,
    startDate,
    endDate,
  }: FetchMovimentationHistoryUseCaseRequest): Promise<FetchMovimentationHistoryUseCaseResponse> {
    let storekeeperId;
    let projectId;
    let materialId;

    const base = await this.baseRepository.findById(baseId);
    if (!base) return left(new ResourceNotFoundError());

    if (email) {
      const storekeeper = await this.storekeeperRepository.findByEmail(email);
      if (!storekeeper) return left(new ResourceNotFoundError());
      storekeeperId = storekeeper.id.toString();
    }

    if (project_number) {
      const project = await this.projectRepository.findByProjectNumber(
        project_number,
        baseId
      );
      if (!project) return left(new ResourceNotFoundError());
      projectId = project.id.toString();
    }

    if (material_code) {
      const material = await this.materialRepository.findByCode(
        material_code,
        base.contractId.toString()
      );
      if (!material) return left(new ResourceNotFoundError());
      materialId = material.id.toString();
    }

    const movimentations =
      await this.movimentationRepository.findManyHistoryWithDetails(
        {
          page,
        },
        baseId,
        storekeeperId,
        projectId,
        materialId,
        startDate,
        endDate
      );

    if (!movimentations.length) return left(new ResourceNotFoundError());

    return right({ movimentations });
  }
}
