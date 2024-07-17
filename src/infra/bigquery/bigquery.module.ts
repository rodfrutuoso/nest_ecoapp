import { Module } from "@nestjs/common";
import { User } from "./schemas/user";
import { BigQueryService } from "./bigquery.service";
import { Material } from "./schemas/materials";

@Module({
  providers: [Material, User, BigQueryService],
  exports: [BigQueryService],
})
export class BigQueryModule {}
