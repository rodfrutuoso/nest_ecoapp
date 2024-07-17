import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { RegisterMaterialController } from "./controllers/register-material.controller";
import { FetchMaterialController } from "./controllers/fetch-materials.controller";
import { BigQueryModule } from "../bigquery/bigquery.module";

@Module({
  imports: [BigQueryModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    RegisterMaterialController,
    FetchMaterialController,
  ],
})
export class HttpModule {}
