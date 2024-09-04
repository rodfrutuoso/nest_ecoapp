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
  }: IdentifierAttributionUseCaseRequest): Promise<IdentifierAttributionResponse> {
    const project = await this.projectRepository.findByID(projectId);
    if (!project)
      return left(new ResourceNotFoundError("projectId não encontrado"));

    const physicaldocumentSearch =
      await this.physicaldocumentRepository.findByIdentifier(identifier);

    if (physicaldocumentSearch && physicaldocumentSearch.unitized === false)
      return left(new ResourceAlreadyRegisteredError("ID já utilizado"));

    const physicalDocument = PhysicalDocument.create({
      projectId: new UniqueEntityID(projectId),
      identifier,
    });

    await this.physicaldocumentRepository.create(physicalDocument);

    return right({ physicalDocument });
  }
}
