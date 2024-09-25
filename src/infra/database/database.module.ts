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
import { BaseRepository } from "src/domain/material-movimentation/application/repositories/base-repository";
import { BudgetRepository } from "src/domain/material-movimentation/application/repositories/budget-repository";
import { ContractRepository } from "src/domain/material-movimentation/application/repositories/contract-repository";
import { MovimentationRepository } from "src/domain/material-movimentation/application/repositories/movimentation-repository";
import { PhysicalDocumentRepository } from "src/domain/material-movimentation/application/repositories/physical-document-repository";
import { ProjectRepository } from "src/domain/material-movimentation/application/repositories/project-repository";
import { EstimatorRepository } from "src/domain/material-movimentation/application/repositories/estimator-repository";
import { BqEstimatorRepository } from "./bigquery/repositories/bq-estimator-repository";
import { UserRepository } from "src/domain/material-movimentation/application/repositories/user-repository";
import { BqUserRepository } from "./bigquery/repositories/bq-user-repository";

@Module({
  imports: [BigQueryModule],
  exports: [
    BigQueryModule,
    { provide: UserRepository, useClass: BqUserRepository },
    { provide: StorekeeperRepository, useClass: BqStorekeeperRepository },
    { provide: EstimatorRepository, useClass: BqEstimatorRepository },
    { provide: MaterialRepository, useClass: BqMaterialRepository },
    { provide: BaseRepository, useClass: BqBaseRepository },
    { provide: BudgetRepository, useClass: BqBudgetRepository },
    { provide: ContractRepository, useClass: BqContractRepository },
    { provide: MovimentationRepository, useClass: BqMovimentationRepository },
    {
      provide: PhysicalDocumentRepository,
      useClass: BqPhysicalDocumentRepository,
    },
    { provide: ProjectRepository, useClass: BqProjectRepository },
  ],
  providers: [
    { provide: UserRepository, useClass: BqUserRepository },
    { provide: StorekeeperRepository, useClass: BqStorekeeperRepository },
    { provide: EstimatorRepository, useClass: BqEstimatorRepository },
    { provide: MaterialRepository, useClass: BqMaterialRepository },
    { provide: BaseRepository, useClass: BqBaseRepository },
    { provide: BudgetRepository, useClass: BqBudgetRepository },
    { provide: ContractRepository, useClass: BqContractRepository },
    { provide: MovimentationRepository, useClass: BqMovimentationRepository },
    {
      provide: PhysicalDocumentRepository,
      useClass: BqPhysicalDocumentRepository,
    },
    { provide: ProjectRepository, useClass: BqProjectRepository },
  ],
})
export class DatabaseModule {}
