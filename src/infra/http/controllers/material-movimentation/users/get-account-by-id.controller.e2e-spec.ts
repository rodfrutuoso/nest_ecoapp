import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { BaseFactory } from "test/factories/make-base";

describe("Get Account by Id (E2E)", () => {
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

  test("[GET] /accounts:id", async () => {
    const base = await baseFactory.makeBqBase()

    const user = await storekeeperFactory.makeBqStorekeeper({
      cpf: "00011122234",
      baseId: base.id
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      type: "Administrador",
    });

    const response = await request(app.getHttpServer())
      .get(`/accounts/${user.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      user: expect.objectContaining({ cpf: "00011122234" }),
    });
  });
});
