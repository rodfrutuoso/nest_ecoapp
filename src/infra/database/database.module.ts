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

@Module({
  imports: [BigQueryModule],
  exports: [
    BigQueryModule,
    BqStorekeeperRepository,
    BqBaseRepository,
    BqBudgetRepository,
    BqContractRepository,
    BqMaterialRepository,
    BqMovimentationRepository,
    BqPhysicalDocumentRepository,
    BqProjectRepository,
  ],
  providers: [
    BqStorekeeperRepository,
    BqBaseRepository,
    BqBudgetRepository,
    BqContractRepository,
    BqMaterialRepository,
    BqMovimentationRepository,
    BqPhysicalDocumentRepository,
    BqProjectRepository,
  ],
})
export class DatabaseModule {}
