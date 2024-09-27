import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { PhysicalDocumentRepository } from "../../repositories/physical-document-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { PhysicalDocumentWithProject } from "src/domain/material-movimentation/enterprise/entities/value-objects/physical-document-with-project";
import { ProjectRepository } from "../../repositories/project-repository";
import { Project } from "src/domain/material-movimentation/enterprise/entities/project";

interface FetchPhysicalDocumentUseCaseRequest {
  page: number;
  baseId: string;
  project_number?: string;
  identifier?: number;
}

type FetchPhysicalDocumentUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    physicaldocuments: PhysicalDocumentWithProject[];
  }
>;

@Injectable()
export class FetchPhysicalDocumentUseCase {
  constructor(
    private physicaldocumentRepository: PhysicalDocumentRepository,
    private projectRepository: ProjectRepository
  ) {}

  async execute({
    page,
    baseId,
    identifier,
    project_number,
  }: FetchPhysicalDocumentUseCaseRequest): Promise<FetchPhysicalDocumentUseCaseResponse> {
    let project: Project | null = null;

    if (project_number) {
      project = await this.projectRepository.findByProjectNumber(
        project_number,
        baseId
      );
      if (!project)
        return left(new ResourceNotFoundError("Projeto não encontrado"));
    }

    const physicaldocuments =
      await this.physicaldocumentRepository.findManyWithProject(
        {
          page,
        },
        baseId,
        identifier,
        project === null ? undefined : project?.id.toString()
      );

    if (!physicaldocuments.length)
      return left(new ResourceNotFoundError("Pesquisa sem resultados"));

    return right({ physicaldocuments });
  }
}
