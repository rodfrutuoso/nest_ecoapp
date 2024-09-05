import { Module } from "@nestjs/common";
import { FetchAccountsQueryDto } from "./material-movimentation/users/dto classes/fetch-accounts.dto";
import { EditAccountBodyDto } from "./material-movimentation/users/dto classes/edit-account.dto";
import { CreateAccountBodyDto } from "./material-movimentation/users/dto classes/create-account.dto";
import { AuthenticateBodyDto } from "./material-movimentation/users/dto classes/authenticate.dto";
import { TransferMovimentationBetweenProjectsBodyDto } from "./material-movimentation/project-movimentation-budget/dto classes/transfer-movimentation-between-projects.dto";
import { TransferMaterialBodyDto } from "./material-movimentation/project-movimentation-budget/dto classes/transfer-material.dto";
import { FetchMovimentationHistoryQueryDto } from "./material-movimentation/project-movimentation-budget/dto classes/fetch-movimentations-history.dto";
import { FetchBudgetMovimentationByProjectQueryDto } from "./material-movimentation/project-movimentation-budget/dto classes/fetch-budget-movimentations-by-project.dto";
import { FetchBudgetByProjectNameQueryDto } from "./material-movimentation/project-movimentation-budget/dto classes/fetch-budget-by-project-name.dto";

@Module({
  providers: [
    FetchAccountsQueryDto,
    EditAccountBodyDto,
    CreateAccountBodyDto,
    AuthenticateBodyDto,
    TransferMovimentationBetweenProjectsBodyDto,
    TransferMaterialBodyDto,
    FetchMovimentationHistoryQueryDto,
    FetchBudgetMovimentationByProjectQueryDto,
    FetchBudgetByProjectNameQueryDto
  ],
  exports: [
    FetchAccountsQueryDto,
    EditAccountBodyDto,
    CreateAccountBodyDto,
    AuthenticateBodyDto,
    TransferMovimentationBetweenProjectsBodyDto,
    TransferMaterialBodyDto,
    FetchMovimentationHistoryQueryDto,
    FetchBudgetMovimentationByProjectQueryDto,
    FetchBudgetByProjectNameQueryDto
  ],
})
export class DtoModule {}
