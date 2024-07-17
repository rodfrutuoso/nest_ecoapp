import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { StorekeeperRepository } from "src/domain/material-movimentation/application/repositories/storekeeper-repository";
import { Storekeeper } from "src/domain/material-movimentation/enterprise/entities/storekeeper";

@Injectable()
export class BqStorekeeperRepository implements StorekeeperRepository {
  create(Storekeeper: Storekeeper): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(StorekeeperId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  save(torekeeper: Storekeeper): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(StorekeeperId: string): Promise<Storekeeper | null> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): Promise<Storekeeper | null> {
    throw new Error("Method not implemented.");
  }
  findMany(params: PaginationParams, baseId?: string): Promise<Storekeeper[]> {
    throw new Error("Method not implemented.");
  }
}
