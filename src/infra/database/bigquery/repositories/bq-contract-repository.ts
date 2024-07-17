import { Injectable } from "@nestjs/common";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { ContractRepository } from "src/domain/material-movimentation/application/repositories/contract-repository";
import { Contract } from "src/domain/material-movimentation/enterprise/entities/contract";

@Injectable()
export class BqContractRepository implements ContractRepository {
  create(Contract: Contract): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findByContractName(contractName: string): Promise<Contract | null> {
    throw new Error("Method not implemented.");
  }
  findMany(params: PaginationParams): Promise<Contract[]> {
    throw new Error("Method not implemented.");
  }
}
