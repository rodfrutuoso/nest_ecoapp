import { Module } from "@nestjs/common";
import { User } from "./schemas/user";
import { BigQueryService } from "./bigquery.service";

@Module({
  providers: [User, BigQueryService],
  exports: [BigQueryService],
})
export class BigQueryModule {}
