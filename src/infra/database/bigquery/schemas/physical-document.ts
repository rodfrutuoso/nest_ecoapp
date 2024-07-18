import { Injectable } from "@nestjs/common";
import { BigQueryMethods } from "bigquery/bigqueryMethods";

const tableId = "physical-document";

export interface BqPhysicalDocumentProps {
  id?: string;
  projectId: string;
  identifier: number;
  unitized: boolean;
}

@Injectable()
export class PhysicalDocument extends BigQueryMethods<BqPhysicalDocumentProps> {
  constructor() {
    super(tableId);
  }
}
