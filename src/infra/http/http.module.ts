import { Module } from "@nestjs/common";
import { DtoModule } from "./swagger dto and decorators/dto.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { CreateAccountController } from "./controllers/material-movimentation/users/create-account.controller";
import { AuthenticateController } from "./controllers/material-movimentation/users/authenticate.controller";
import { CreateMaterialController } from "./controllers/material-movimentation/material/create-material.controller";
import { FetchMaterialController } from "./controllers/material-movimentation/material/fetch-materials.controller";
import { CreateMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/create-material";
import { FetchMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/fetch-material";
import { AuthenticateUserUseCase } from "src/domain/material-movimentation/application/use-cases/users/authenticate-user";
import { RegisterStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/register-storekeeper";
import { GetStorekeeperByidController } from "./controllers/material-movimentation/users/get-account-by-id.controller";
import { GetStorekeeperByIdUseCase } from "src/domain/material-movimentation/application/use-cases/users/get-storekeeper-by-id";
import { EditAccountController } from "./controllers/material-movimentation/users/edit-account.controller";
import { EditStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/edit-storekeeper";
import { DeleteStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/delete-storekeeper";
import { DeleteAccountController } from "./controllers/material-movimentation/users/delete-account.controller";
import { FetchAccountsController } from "./controllers/material-movimentation/users/fetch-accounts.controller";
import { FetchStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/fetch-storekeeper";
import { RegisterContractController } from "./controllers/material-movimentation/contract-base/register-contract.controller";
import { RegisterContractUseCase } from "src/domain/material-movimentation/application/use-cases/contract-base/register-contract";
import { FetchContractController } from "./controllers/material-movimentation/contract-base/fetch-contracts.controller";
import { FetchContractUseCase } from "src/domain/material-movimentation/application/use-cases/contract-base/fetch-contract";
import { RegisterBaseUseCase } from "src/domain/material-movimentation/application/use-cases/contract-base/register-base";
import { RegisterBaseController } from "./controllers/material-movimentation/contract-base/register-base.controller";
import { FetchBaseController } from "./controllers/material-movimentation/contract-base/fetch-base.controller";
import { FetchBaseUseCase } from "src/domain/material-movimentation/application/use-cases/contract-base/fetch-base";
import { IdentifierAttributionUseCase } from "src/domain/material-movimentation/application/use-cases/physicalDocument/identifier-attribution";
import { IdentifierAttributionController } from "./controllers/material-movimentation/physicalDocument/identifier-attribution.controller";
import { FetchPhysicalDocumentsController } from "./controllers/material-movimentation/physicalDocument/fetch-physical-document.controller";
import { FetchPhysicalDocumentUseCase } from "src/domain/material-movimentation/application/use-cases/physicalDocument/fetch-physical-document";
import { UnitizePhysicalDocumentController } from "./controllers/material-movimentation/physicalDocument/unitize-physical-document.controller";
import { UnitizePhysicalDocumentUseCase } from "src/domain/material-movimentation/application/use-cases/physicalDocument/unitize-physical-document";
import { DeletePhysicalDocumentController } from "./controllers/material-movimentation/physicalDocument/delete-physical-document..controller";
import { DeletePhysicalDocumentUseCase } from "src/domain/material-movimentation/application/use-cases/physicalDocument/delete-physical-document";
import { TransferMaterialController } from "./controllers/material-movimentation/project-movimentation-budget/transfer-material.controller";
import { TransferMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/transfer-material";
import { RegisterProjectUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/register-project";
import { RegisterProjectController } from "./controllers/material-movimentation/project-movimentation-budget/register-project.controller";
import { TransferMovimentationBetweenProjectsController } from "./controllers/material-movimentation/project-movimentation-budget/transfer-movimentation-between-projects.controller";
import { TransferMovimentationBetweenProjectsUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/transfer-movimentation-between-projects";
import { FetchMovimentationHistoryController } from "./controllers/material-movimentation/project-movimentation-budget/fetch-movimentations-history.controller";
import { FetchMovimentationHistoryUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-movimentations-history";
import { FetchBudgetMovimentationByProjectController } from "./controllers/material-movimentation/project-movimentation-budget/fetch-budget-movimentations-by-project.controller";
import { FetchBudgetMovimentationByProjectUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-budget-movimentations-by-project";
import { FetchBudgetByProjectNameController } from "./controllers/material-movimentation/project-movimentation-budget/fetch-budget-by-project-name.controller";
import { FetchBudgetByProjectNameUseCase } from "src/domain/material-movimentation/application/use-cases/project-movimentation-budget/fetch-budget-by-project-name";

@Module({
  imports: [DatabaseModule, CryptographyModule, DtoModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateMaterialController,
    FetchMaterialController,
    GetStorekeeperByidController,
    EditAccountController,
    DeleteAccountController,
    FetchAccountsController,
    RegisterContractController,
    FetchContractController,
    RegisterBaseController,
    FetchBaseController,
    IdentifierAttributionController,
    FetchPhysicalDocumentsController,
    UnitizePhysicalDocumentController,
    DeletePhysicalDocumentController,
    TransferMaterialController,
    RegisterProjectController,
    TransferMovimentationBetweenProjectsController,
    FetchMovimentationHistoryController,
    FetchBudgetMovimentationByProjectController,
    FetchBudgetByProjectNameController,
  ],
  providers: [
    CreateMaterialUseCase,
    FetchMaterialUseCase,
    AuthenticateUserUseCase,
    RegisterStorekeeperUseCase,
    GetStorekeeperByIdUseCase,
    EditStorekeeperUseCase,
    DeleteStorekeeperUseCase,
    FetchStorekeeperUseCase,
    RegisterContractUseCase,
    FetchContractUseCase,
    RegisterBaseUseCase,
    FetchBaseUseCase,
    IdentifierAttributionUseCase,
    FetchPhysicalDocumentUseCase,
    UnitizePhysicalDocumentUseCase,
    DeletePhysicalDocumentUseCase,
    TransferMaterialUseCase,
    RegisterProjectUseCase,
    TransferMovimentationBetweenProjectsUseCase,
    FetchMovimentationHistoryUseCase,
    FetchBudgetMovimentationByProjectUseCase,
    FetchBudgetByProjectNameUseCase,
  ],
})
export class HttpModule {}
