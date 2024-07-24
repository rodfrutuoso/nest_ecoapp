import { Module } from "@nestjs/common";
import { BigQueryModule } from "./bigquery/bigquery.module";
import { BqStorekeeperRepository } from "./bigquery/repositories/bq-storekeeper-repository";
import { BqBaseRepository } from "./bigquery/repositories/bq-base-repository";
import { BqBudgetRepository } from "./bigquery/repositories/bq-budget-repository";
import { BqContractRepository } from "./bigquery/repositories/bq-contract-repository";
import { BqMaterialRepository } from "./bigquery/repositories/bq-material-repository";
import { BqMovimentationRepository } from "./bigquery/repositories/bq-movimentation-repository";
import { BqPhysicalDocumentRepository } from "./bigquery/repositories/bq-physical-document-repository";
import { BqProjectRepository } from "./bigquery/repositories/bq-project-repository";
import { MaterialRepository } from "src/domain/material-movimentation/application/repositories/material-repository";
import { StorekeeperRepository } from "src/domain/material-movimentation/application/repositories/storekeeper-repository";

@Module({
  imports: [BigQueryModule],
  exports: [
    BigQueryModule,
    { provide: StorekeeperRepository, useClass: BqStorekeeperRepository },
    BqBaseRepository,
    BqBudgetRepository,
    BqContractRepository,
    { provide: MaterialRepository, useClass: BqMaterialRepository },
    BqMovimentationRepository,
    BqPhysicalDocumentRepository,
    BqProjectRepository,
  ],
  providers: [
    { provide: StorekeeperRepository, useClass: BqStorekeeperRepository },
    BqBaseRepository,
    BqBudgetRepository,
    BqContractRepository,
    { provide: MaterialRepository, useClass: BqMaterialRepository },
    BqMovimentationRepository,
    BqPhysicalDocumentRepository,
    BqProjectRepository,
  ],
})
export class DatabaseModule {}
