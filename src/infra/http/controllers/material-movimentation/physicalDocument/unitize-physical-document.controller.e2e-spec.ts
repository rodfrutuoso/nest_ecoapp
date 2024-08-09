import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { PhysicalDocumentFactory } from "test/factories/make-physical-document";

describe("Unitize Physical Document (E2E)", () => {
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

  test("[PUT] /physical-documents:id", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const physicalDocument =
      await physicalDocumentFactory.makeBqPhysicalDocument({ identifier: 1 });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .put(`/physical-documents/${physicalDocument.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        unitized: true,
      });

    const [physicalDocumentDataBase] = await bigquery.physicalDocument.select({
      where: { identifier: 1 },
    });

    expect(response.statusCode).toBe(204);
    expect(physicalDocumentDataBase.unitized).toEqual(true);
  });
});
