import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { PhysicalDocumentRepository } from "src/domain/material-movimentation/application/repositories/physical-document-repository";
import { PhysicalDocument } from "src/domain/material-movimentation/enterprise/entities/physical-document";

@Injectable()
export class BqPhysicalDocumentRepository implements PhysicalDocumentRepository {
  create(physicalDocument: PhysicalDocument): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findByIdentifier(identifier: number): Promise<PhysicalDocument | null> {
    throw new Error("Method not implemented.");
  }
  findByID(id: string): Promise<PhysicalDocument | null> {
    throw new Error("Method not implemented.");
  }
  save(physicalDocument: PhysicalDocument): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findMany(
    params: PaginationParams,
    identifier?: number,
    projectId?: string
  ): Promise<PhysicalDocument[]> {
    throw new Error("Method not implemented.");
  }
  delete(physicalDocumentId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
