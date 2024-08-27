import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { PhysicalDocumentFactory } from "test/factories/make-physical-document";

describe("Fetch Physical Documents (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let physicalDocumentFactory: PhysicalDocumentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StorekeeperFactory, PhysicalDocumentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    physicalDocumentFactory = moduleRef.get(PhysicalDocumentFactory);

    await app.init();
  });

  test("[GET] /physical-documents", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    await physicalDocumentFactory.makeBqPhysicalDocument({ identifier: 2 });
    await physicalDocumentFactory.makeBqPhysicalDocument({ identifier: 2 });
    await physicalDocumentFactory.makeBqPhysicalDocument({ identifier: 2 });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get("/physical-documents?identifier=2")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.physicalDocuments).toHaveLength(3);
  });
});
