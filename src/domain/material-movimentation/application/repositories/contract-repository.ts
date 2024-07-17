import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Contract } from "../../enterprise/entities/contract";

export interface ContractRepository {
  create(Contract: Contract): Promise<void>;
  findByContractName(contractName: string): Promise<Contract | null>;
  findMany(params: PaginationParams): Promise<Contract[]>;
}
