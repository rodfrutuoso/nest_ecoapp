import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";
import { BqBaseProps } from "./base";
import { UserType } from "src/core/types/user-type";

const tableId = "user";

export interface BqUserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  type: string;
  status: string;
  baseId: string;
  contractId: string;

  // relacionamentos
  base?: BqBaseProps;
}

@Injectable()
export class User extends BigQueryMethods<BqUserProps> {
  constructor() {
    super(tableId);
  }
}
