import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";

const tableId = "materials";

export interface MaterialProps {
  id?: string;
  code: number;
  description: string;
  type: string;
  unit: string;
  contractId: string;
}

@Injectable()
export class Material extends BigQueryMethods<MaterialProps> {
  constructor() {
    super(tableId);
  }
}
