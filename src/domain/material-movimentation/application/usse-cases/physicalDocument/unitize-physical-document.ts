import { Eihter, left, right } from "../../../../../core/either";
import { PhysicalDocumentRepository } from "../../repositories/physical-document-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface UnitizePhysicalDocumentUseCaseRequest {
  id: string;
  unitized: boolean;
}

type UnitizePhysicalDocumentResponse = Eihter<ResourceNotFoundError, null>;

export class UnitizePhysicalDocumentUseCase {
  constructor(private physicaldocumentRepository: PhysicalDocumentRepository) {}

  async execute({
    id,
    unitized,
  }: UnitizePhysicalDocumentUseCaseRequest): Promise<UnitizePhysicalDocumentResponse> {
    const physicalDocument = await this.physicaldocumentRepository.findByID(id);

    if (!physicalDocument) return left(new ResourceNotFoundError());

    physicalDocument.unitized = unitized;

    await this.physicaldocumentRepository.save(physicalDocument);

    return right(null);
  }
}
