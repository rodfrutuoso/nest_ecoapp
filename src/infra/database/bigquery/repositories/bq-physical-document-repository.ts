import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { PhysicalDocumentRepository } from "src/domain/material-movimentation/application/repositories/physical-document-repository";
import { PhysicalDocument } from "src/domain/material-movimentation/enterprise/entities/physical-document";
import { BigQueryService } from "../bigquery.service";
import { BqPhysicalDocumentMapper } from "../mappers/bq-physical-document-mapper";
import { PhysicalDocumentWithProject } from "src/domain/material-movimentation/enterprise/entities/value-objects/physical-document-with-project";
import { BqPhysicalDocumentWithProjectMapper } from "../mappers/bq-physical-document-with-project-mapper";

@Injectable()
export class BqPhysicalDocumentRepository
  implements PhysicalDocumentRepository
{
  constructor(private bigquery: BigQueryService) {}

  async create(physicalDocument: PhysicalDocument): Promise<void> {
    const data = BqPhysicalDocumentMapper.toBigquery(physicalDocument);

    await this.bigquery.physicalDocument.create([data]);
  }

  async findByIdentifier(identifier: number): Promise<PhysicalDocument | null> {
    const [physicalDocument] = await this.bigquery.physicalDocument.select({
      where: { identifier },
    });

    if (!physicalDocument) return null;

    return BqPhysicalDocumentMapper.toDomin(physicalDocument);
  }

  async findByID(id: string): Promise<PhysicalDocument | null> {
    const [physicalDocument] = await this.bigquery.physicalDocument.select({
      where: { id },
    });

    if (!physicalDocument) return null;

    return BqPhysicalDocumentMapper.toDomin(physicalDocument);
  }

  async save(physicalDocument: PhysicalDocument): Promise<void> {
    await this.bigquery.physicalDocument.update({
      data: BqPhysicalDocumentMapper.toBigquery(physicalDocument),
      where: { id: BqPhysicalDocumentMapper.toBigquery(physicalDocument).id },
    });
  }

  async findMany(
    { page }: PaginationParams,
    identifier?: number,
    projectId?: string
  ): Promise<PhysicalDocument[]> {
    const pageCount = 40;

    const physicalDocuments = await this.bigquery.physicalDocument.select({
      where: { projectId, identifier },
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "identifier", direction: "ASC" },
    });

    return physicalDocuments.map(BqPhysicalDocumentMapper.toDomin);
  }

  async findManyWithProject(
    { page }: PaginationParams,
    identifier?: number,
    projectId?: string
  ): Promise<PhysicalDocumentWithProject[]> {
    const pageCount = 40;

    const physicalDocuments = await this.bigquery.physicalDocument.select({
      where: { projectId, identifier },
      limit: pageCount,
      offset: pageCount * (page - 1),
      orderBy: { column: "identifier", direction: "ASC" },
      include: {
        project: {
          join: {
            table: "project",
            on: "physical-document.projectId = project.id",
          },
          relationType: "one-to-one",
        },
      },
    });

    return physicalDocuments.map(BqPhysicalDocumentWithProjectMapper.toDomin);
  }

  async delete(physicalDocumentId: string): Promise<void> {
    await this.bigquery.physicalDocument.delete({ id: physicalDocumentId });
  }
}
