import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";

const tableId = "users";

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class User extends BigQueryMethods<UserProps> {
  constructor() {
    super(tableId);
  }
}
