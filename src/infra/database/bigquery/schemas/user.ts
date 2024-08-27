import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";
import { BqBaseProps } from "./base";

const tableId = "users";

export interface BqUserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  type: string;
  status: string;
  baseId?: string | null;
  contractId?: string | null;

  // relacionamentos
  base?: BqBaseProps;
}

@Injectable()
export class User extends BigQueryMethods<BqUserProps> {
  constructor() {
    super(tableId);
  }
}
