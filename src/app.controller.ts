import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { BigQueryService } from "src/bigquery/bigquery.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly bigQueryService: BigQueryService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("bigquery")
  async getBQ(): Promise<any> {
    return await this.bigQueryService.user.create([
      { name: "Rodrigooo", email: "rodfrutuoso", password: "minhaDega" },
    ]);
    // return await this.bigQueryService.runQuery(
    //   "Select * from `movimentation.users`"
    // );
  }
}
