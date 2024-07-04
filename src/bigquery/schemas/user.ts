import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";

const datasetId_tableId = "movimentation.users";

interface UserProps {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class User extends BigQueryMethods<UserProps> {
  constructor() {
    super(datasetId_tableId);
  }
}
