import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateMaterialController } from "./controllers/create-material.controller";
import { FetchMaterialController } from "./controllers/fetch-materials.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/create-material";
import { FetchMaterialUseCase } from "src/domain/material-movimentation/application/use-cases/material/fetch-material";
import { AuthenticateStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/authenticate-storekeeper";
import { RegisterStorekeeperUseCase } from "src/domain/material-movimentation/application/use-cases/users/register-storekeeper";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { GetStorekeeperByidController } from "./controllers/get-account-by-id.controller";
import { GetStorekeeperByIdUseCase } from "src/domain/material-movimentation/application/use-cases/users/get-storekeeper-by-id";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateMaterialController,
    FetchMaterialController,
    GetStorekeeperByidController,
  ],
  providers: [
    CreateMaterialUseCase,
    FetchMaterialUseCase,
    AuthenticateStorekeeperUseCase,
    RegisterStorekeeperUseCase,
    GetStorekeeperByIdUseCase,
  ],
})
export class HttpModule {}
