import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";

describe("Fetch Accounts (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StorekeeperFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);

    await app.init();
  });

  test("[GET] /materials", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({
      name: "rodrigo",
    });
    await storekeeperFactory.makeBqStorekeeper({ name: "max" });
    await storekeeperFactory.makeBqStorekeeper({ name: "rafael" });

    const accessToken = jwt.sign({ sub: user.id.toString() });
    const contractId = randomUUID();

    const response = await request(app.getHttpServer())
      .get("/accounts?page=1")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ contractId, type: "concreto" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({ name: "rodrigo" }),
        expect.objectContaining({ name: "rafael" }),
        expect.objectContaining({ name: "max" }),
      ]),
    });
  });
});
