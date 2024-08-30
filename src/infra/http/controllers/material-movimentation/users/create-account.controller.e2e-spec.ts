import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { BaseFactory } from "test/factories/make-base";

describe("Create account (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let baseFactory: BaseFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StorekeeperFactory, BaseFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    baseFactory = moduleRef.get(BaseFactory);

    await app.init();
  });

  test("[POST] /accounts", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const accessToken = jwt.sign({ sub: user.id.toString() });
    const base = await baseFactory.makeBqBase();

    const response = await request(app.getHttpServer())
      .post("/accounts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Joao da Pilotinha",
        email: "joaopilotinha@ecoeletrica.com.br",
        password: "123456",
        cpf: "00011122234",
        status: "ative",
        type: "administrator",
        baseId: base.id.toString(),
      });

    const [userDataBase] = await bigquery.user.select({
      where: { email: "joaopilotinha@ecoeletrica.com.br" },
    });

    expect(response.statusCode).toBe(201);
    expect(userDataBase.name).toEqual("Joao da Pilotinha");
  });
});
