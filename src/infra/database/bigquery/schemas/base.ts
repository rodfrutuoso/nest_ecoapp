import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";

const tableId = "base";

export interface BqBaseProps {
  id?: string;
  projectId: string;
  materialId: string;
  value: number;
  createdAt: Date;
  userId: string;
  contractId: string;
}

@Injectable()
export class Base extends BigQueryMethods<BqBaseProps> {
  constructor() {
    super(tableId);
  }
}
