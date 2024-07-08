import { Module } from "@nestjs/common";
import { BigQueryModule } from "./bigquery/bigquery.module";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";

@Module({
  imports: [
    BigQueryModule,
    AuthModule,
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
  ],
  controllers: [CreateAccountController],
  providers: [],
})
export class AppModule {}
