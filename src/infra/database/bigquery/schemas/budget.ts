import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";

const tableId = "budget";

export interface BqBudgetProps {
  id?: string;
  budgetName: string;
  contractId: Date;
}

@Injectable()
export class Budget extends BigQueryMethods<BqBudgetProps> {
  constructor() {
    super(tableId);
  }
}
