import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { BaseRepository } from "src/domain/material-movimentation/application/repositories/base-repository";
import { Base } from "src/domain/material-movimentation/enterprise/entities/base";

@Injectable()
export class BqBaseRepository implements BaseRepository {
  create(Base: Base): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findByBaseName(baseName: string): Promise<Base | null> {
    throw new Error("Method not implemented.");
  }
  findMany(params: PaginationParams): Promise<Base[]> {
    throw new Error("Method not implemented.");
  }
}
