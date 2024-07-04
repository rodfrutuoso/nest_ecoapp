import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BigQueryModule } from "./bigquery/bigquery.module";

@Module({
  imports: [BigQueryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
