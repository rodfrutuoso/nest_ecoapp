import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/bigquery/bigquery.service";

describe("Create account (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);

    await app.init();
  });

  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      name: "Joao da Pilotinha",
      email: "joaopilotinha@ecoeletrica.com.br",
      password: "123456",
    });

    const [userDataBase] = await bigquery.user.select({
      where: { email: "joaopilotinha@ecoeletrica.com.br" },
    });

    expect(response.statusCode).toBe(201);
    expect(userDataBase.name).toEqual("Joao da Pilotinha")
  });
});
