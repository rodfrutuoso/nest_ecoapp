import { Eihter, left, right } from "../../../../../core/either";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { PhysicalDocument } from "../../../enterprise/entities/physical-document";
import { PhysicalDocumentRepository } from "../../repositories/physical-document-repository";
import { ResourceAlreadyRegisteredError } from "../errors/resource-already-registered-error";

interface IdentifierAttributionUseCaseRequest {
  projectId: string;
  identifier: number;
}

type IdentifierAttributionResponse = Eihter<
  ResourceAlreadyRegisteredError,
  {
    physicalDocument: PhysicalDocument;
  }
>;

export class IdentifierAttributionUseCase {
  constructor(private physicaldocumentRepository: PhysicalDocumentRepository) {}

  async execute({
    projectId,
    identifier,
  }: IdentifierAttributionUseCaseRequest): Promise<IdentifierAttributionResponse> {
    const physicaldocumentSearch =
      await this.physicaldocumentRepository.findByIdentifier(identifier);

    if (physicaldocumentSearch)
      return left(new ResourceAlreadyRegisteredError());

    const physicalDocument = PhysicalDocument.create({
      projectId: new UniqueEntityID(projectId),
      identifier,
    });

    await this.physicaldocumentRepository.create(physicalDocument);

    return right({ physicalDocument });
  }
}
