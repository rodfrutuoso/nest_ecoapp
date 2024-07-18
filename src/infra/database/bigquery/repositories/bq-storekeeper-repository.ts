import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { StorekeeperRepository } from "src/domain/material-movimentation/application/repositories/storekeeper-repository";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";
import { BigQueryService } from "../bigquery.service";

@Injectable()
export class BqStorekeeperRepository implements StorekeeperRepository {
  constructor(private bigquery: BigQueryService) {}

  async create(Storekeeper: Storekeeper): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async delete(StorekeeperId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async save(torekeeper: Storekeeper): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async findById(StorekeeperId: string): Promise<Storekeeper | null> {
    throw new Error("Method not implemented.");
  }
  async findByEmail(email: string): Promise<Storekeeper | null> {
    throw new Error("Method not implemented.");
  }
  async findMany(params: PaginationParams, baseId?: string): Promise<Storekeeper[]> {
    throw new Error("Method not implemented.");
  }
}
