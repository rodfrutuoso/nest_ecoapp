import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { PhysicalDocument } from "../../../enterprise/entities/physical-document";
import { PhysicalDocumentRepository } from "../../repositories/physical-document-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";
import { ProjectRepository } from "../../repositories/project-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface IdentifierAttributionUseCaseRequest {
  projectId: string;
  identifier: number;
  baseId: string;
}

type IdentifierAttributionResponse = Eihter<
  ResourceAlreadyRegisteredError | ResourceNotFoundError,
  {
    physicalDocument: PhysicalDocument;
  }
>;

@Injectable()
export class IdentifierAttributionUseCase {
  constructor(
    private physicaldocumentRepository: PhysicalDocumentRepository,
    private projectRepository: ProjectRepository
  ) {}

  async execute({
    projectId,
    identifier,
    baseId,
  }: IdentifierAttributionUseCaseRequest): Promise<IdentifierAttributionResponse> {
    const project = await this.projectRepository.findByID(projectId);
    if (!project || project.baseId.toString() !== baseId)
      return left(new ResourceNotFoundError("projectId não encontrado"));

    const physicaldocumentSearch =
      await this.physicaldocumentRepository.findByIdentifierProjectId(
        identifier,
        projectId
      );

    const isIdentifierUsed = physicaldocumentSearch.find(
      (item) => item.identifier === identifier && item.unitized === false
    );

    if (isIdentifierUsed)
      return left(new ResourceAlreadyRegisteredError("O ID já utilizado"));

    const isProjectIdUsed = physicaldocumentSearch.find(
      (item) => item.projectId.toString() === projectId
    );

    if (isProjectIdUsed)
      return left(new ResourceAlreadyRegisteredError("O Projeto já tem ID"));

    const physicalDocument = PhysicalDocument.create({
      projectId: new UniqueEntityID(projectId),
      identifier,
    });

    await this.physicaldocumentRepository.create(physicalDocument);

    return right({ physicalDocument });
  }
}
