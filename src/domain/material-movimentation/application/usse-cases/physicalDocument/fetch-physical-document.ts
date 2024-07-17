import { Eihter, left, right } from "../../../../../core/either";
import { PhysicalDocument } from "../../../enterprise/entities/physical-document";
import { PhysicalDocumentRepository } from "../../repositories/physical-document-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

interface FetchPhysicalDocumentUseCaseRequest {
  page: number;
  projectId?: string;
  identifier?: number;
}

type FetchPhysicalDocumentUseCaseResponse = Eihter<
  ResourceNotFoundError,
  {
    physicaldocuments: PhysicalDocument[];
  }
>;

export class FetchPhysicalDocumentUseCase {
  constructor(private physicaldocumentRepository: PhysicalDocumentRepository) {}

  async execute({
    page,
    identifier,
    projectId,
  }: FetchPhysicalDocumentUseCaseRequest): Promise<FetchPhysicalDocumentUseCaseResponse> {
    const physicaldocuments = await this.physicaldocumentRepository.findMany(
      {
        page,
      },
      identifier,
      projectId,
    );

    if (!physicaldocuments.length) return left(new ResourceNotFoundError());

    return right({ physicaldocuments });
  }
}
