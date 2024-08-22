import { Injectable } from "@nestjs/common";
import { Eihter, left, right } from "../../../../../core/either";
import { PhysicalDocumentRepository } from "../../repositories/physical-document-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { PhysicalDocumentWithProject } from "src/domain/material-movimentation/enterprise/entities/value-objects/physical-document-with-project";

interface FetchPhysicalDocumentUseCaseRequest {
  page: number;
  projectId?: string;
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
  constructor(private physicaldocumentRepository: PhysicalDocumentRepository) {}

  async execute({
    page,
    identifier,
    projectId,
  }: FetchPhysicalDocumentUseCaseRequest): Promise<FetchPhysicalDocumentUseCaseResponse> {
    const physicaldocuments =
      await this.physicaldocumentRepository.findManyWithProject(
        {
          page,
        },
        identifier,
        projectId
      );

    if (!physicaldocuments.length) return left(new ResourceNotFoundError());

    return right({ physicaldocuments });
  }
}
