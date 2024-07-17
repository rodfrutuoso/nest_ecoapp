import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { PhysicalDocument } from "../../enterprise/entities/physical-document";

export interface PhysicalDocumentRepository {
  create(physicalDocument: PhysicalDocument): Promise<void>;
  findByIdentifier(identifier: number): Promise<PhysicalDocument | null>;
  findByID(id: string): Promise<PhysicalDocument | null>;
  save(physicalDocument: PhysicalDocument): Promise<void>;
  findMany(
    params: PaginationParams,
    identifier?: number,
    projectId?: string
  ): Promise<PhysicalDocument[]>;
  delete(physicalDocumentId: string): Promise<void>;
}
