import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/material-movimentation/users/create-account.controller";
import { AuthenticateController } from "./controllers/material-movimentation/users/authenticate.controller";
import { CreateMaterialController } from "./controllers/material-movimentation/material/create-material.controller";
import { FetchMaterialController } from "./controllers/material-movimentation/material/fetch-materials.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/create-material";
import { FetchMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/fetch-material";
import { AuthenticateStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/authenticate-storekeeper";
import { RegisterStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/register-storekeeper";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { GetStorekeeperByidController } from "./controllers/material-movimentation/users/get-account-by-id.controller";
import { GetStorekeeperByIdUseCase } from "src/domain/material-movimentation/application/use-cases/users/get-storekeeper-by-id";
import { EditAccountController } from "./controllers/material-movimentation/users/edit-account.controller";
import { EditStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/edit-storekeeper";
import { DeleteStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/delete-storekeeper";
import { DeleteAccountController } from "./controllers/material-movimentation/users/delete-account.controller";
import { FetchAccountsController } from "./controllers/material-movimentation/users/fetch-accounts.controller";
import { FetchStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/fetch-storekeeper";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateMaterialController,
    FetchMaterialController,
    GetStorekeeperByidController,
    EditAccountController,
    DeleteAccountController,
    FetchAccountsController,
  ],
  providers: [
    CreateMaterialUseCase,
    FetchMaterialUseCase,
    AuthenticateStorekeeperUseCase,
    RegisterStorekeeperUseCase,
    GetStorekeeperByIdUseCase,
    EditStorekeeperUseCase,
    DeleteStorekeeperUseCase,
    FetchStorekeeperUseCase,
  ],
})
export class HttpModule {}
