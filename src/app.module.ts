import { Module } from "@nestjs/common";
import { BigQueryModule } from "./bigquery/bigquery.module";
import { CreateAccountController } from "./controllers/create-account.controller";

@Module({
  imports: [BigQueryModule],
  controllers: [CreateAccountController],
  providers: [],
})
export class AppModule {}
