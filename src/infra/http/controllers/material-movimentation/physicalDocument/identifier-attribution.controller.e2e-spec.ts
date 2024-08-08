import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { randomUUID } from "crypto";

describe("Identifier Attribution (E2E)", () => {
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

  test("[POST] /physical-documents", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const accessToken = jwt.sign({ sub: user.id.toString() });
    const projectId = randomUUID();

    const response = await request(app.getHttpServer())
      .post("/physical-documents")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        projectId,
        identifier: 2,
      });

    const [physicalDocumentDataBase] = await bigquery.physicalDocument.select({
      where: { identifier: 2 },
    });

    expect(response.statusCode).toBe(201);
    expect(physicalDocumentDataBase.identifier).toEqual(2);
  });
});
