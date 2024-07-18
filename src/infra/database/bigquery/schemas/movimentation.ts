import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";

const tableId = "movimentation";

export interface BqMovimentationProps {
  id?: string;
  projectId: string;
  materialId: string;
  value: number;
  createdAt: Date;
  userId: string;
  observation: string;
  baseId: string;
}

@Injectable()
export class Movimentation extends BigQueryMethods<BqMovimentationProps> {
  constructor() {
    super(tableId);
  }
}
