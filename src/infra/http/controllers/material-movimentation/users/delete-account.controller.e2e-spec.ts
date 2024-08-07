import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";

describe("Delete Account (E2E)", () => {
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

  test("[DELETE] /accounts:id", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({
      type: "Administrator",
    });
    const userToDelete = await storekeeperFactory.makeBqStorekeeper({
      name: "Joao Excluido",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .delete(`/accounts/${userToDelete.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    const search = await bigquery.user.select({
      where: { name: "Joao Excluido" },
    });

    expect(response.statusCode).toBe(204);
    expect(search).toHaveLength(0);
  });
});
