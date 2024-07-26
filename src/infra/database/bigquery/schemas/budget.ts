import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";

const tableId = "budget";

export interface BqBudgetProps {
  id?: string;
  userId: string;
  contractId: string;
  projectId: string;
  materialId: string;
  value: number;
  createdAt: Date;
}

@Injectable()
export class Budget extends BigQueryMethods<BqBudgetProps> {
  constructor() {
    super(tableId);
  }
}
