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

  @Get("bigquerycreate")
  async getBQCreate(): Promise<any> {
    return await this.bigQueryService.user.create([
      { name: "Rodrigooo", email: "rodfrutuoso", password: "minhaDega" },
    ]);
  }

  @Get("bigquerydelete")
  async getBQDelete(): Promise<any> {
    return await this.bigQueryService.user.delete({
      email: "rodfrutuoso@ecoeletrica.com.br",
    });
  }

  @Get("bigqueryupdate")
  async getBQupdate(): Promise<any> {
    return await this.bigQueryService.user.update({
      where: { email: "rodfrutuoso" },
      data: { email: "rodfrutuoso@ecoeletrica.com.br" },
    });
  }

  @Get("bigqueryselect")
  async getBQselect(): Promise<any> {
    return await this.bigQueryService.user.select({columns:["email","id"],where:{email:"rodfrutuoso"}});
  }

  @Get("bigqueryselectescrito")
  async getBQselectescrito(): Promise<any> {
    return await this.bigQueryService.user.runQuery(
      "Select name, email from `movimentation.users` where password = '123456'"
    );
  }
}
