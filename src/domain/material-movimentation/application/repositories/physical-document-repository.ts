import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { PhysicalDocument } from "../../enterprise/entities/physical-document";

export abstract class PhysicalDocumentRepository {
  abstract create(physicalDocument: PhysicalDocument): Promise<void>;
  abstract findByIdentifier(
    identifier: number
  ): Promise<PhysicalDocument | null>;
  abstract findByID(id: string): Promise<PhysicalDocument | null>;
  abstract save(physicalDocument: PhysicalDocument): Promise<void>;
  abstract findMany(
    params: PaginationParams,
    identifier?: number,
    projectId?: string
  ): Promise<PhysicalDocument[]>;
  abstract delete(physicalDocumentId: string): Promise<void>;
}
