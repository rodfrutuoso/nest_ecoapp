import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { randomUUID } from "crypto";

describe("Transfer Material (E2E)", () => {
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

  test("[POST] /movimentation", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const projectId = randomUUID();
    const baseId = randomUUID();
    const materialId = randomUUID();

    const response = await request(app.getHttpServer())
      .post("/movimentation")
      .set("Authorization", `Bearer ${accessToken}`)
      .send([
        {
          materialId,
          projectId,
          observation: "nao sei das quantas",
          baseId,
          value: 5,
        },
        {
          materialId,
          projectId,
          observation: "nao sei das quantas",
          baseId,
          value: 2,
        },
        {
          materialId,
          projectId,
          observation: "nao sei das quantas",
          baseId,
          value: -1,
        },
      ]);

    const movimentationDataBase = await bigquery.movimentation.select({
      where: { projectId },
    });

    expect(response.statusCode).toBe(201);
    expect(movimentationDataBase).toHaveLength(3);
  });
});
