import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { PhysicalDocumentRepository } from "src/domain/material-movimentation/application/repositories/physical-document-repository";
import { PhysicalDocument } from "src/domain/material-movimentation/enterprise/entities/physical-document";
import { BigQueryService } from "../bigquery.service";

@Injectable()
export class BqPhysicalDocumentRepository
  implements PhysicalDocumentRepository
{
  constructor(private bigquery: BigQueryService) {}

  async create(physicalDocument: PhysicalDocument): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findByIdentifier(identifier: number): Promise<PhysicalDocument | null> {
    throw new Error("Method not implemented.");
  }

  async findByID(id: string): Promise<PhysicalDocument | null> {
    throw new Error("Method not implemented.");
  }

  async save(physicalDocument: PhysicalDocument): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  async findMany(
    params: PaginationParams,
    identifier?: number,
    projectId?: string
  ): Promise<PhysicalDocument[]> {
    throw new Error("Method not implemented.");
  }
  
  async delete(physicalDocumentId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
