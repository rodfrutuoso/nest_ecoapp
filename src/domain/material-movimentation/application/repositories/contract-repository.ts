import { PaginationParams } from "../../../../core/repositories/pagination-params";
import { Contract } from "../../enterprise/entities/contract";

export abstract class ContractRepository {
  abstract create(Contract: Contract): Promise<void>;
  abstract findByContractName(contractName: string): Promise<Contract | null>;
  abstract findMany(params: PaginationParams): Promise<Contract[]>;
}
