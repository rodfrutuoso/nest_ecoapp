import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { MaterialFactory } from "test/factories/make-material";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { DatabaseModule } from "src/infra/database/database.module";

describe("Fetch Materials (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let materialFactory: MaterialFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StorekeeperFactory, MaterialFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    materialFactory = moduleRef.get(MaterialFactory);

    await app.init();
  });

  test("[GET] /materials", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const accessToken = jwt.sign({ sub: user.id.toString() });
    const contractId = randomUUID();

    await materialFactory.makeBqMaterial({
      code: 123132,
      type: "concreto",
      contractId: new UniqueEntityID(contractId),
    });

    await materialFactory.makeBqMaterial({
      code: 123133,
      type: "concreto",
      contractId: new UniqueEntityID(contractId),
    });

    await materialFactory.makeBqMaterial({
      code: 123134,
      type: "concreto",
      contractId: new UniqueEntityID(contractId),
    });

    const response = await request(app.getHttpServer())
      .get("/materials")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ contractId, type: "concreto" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      materials: [
        expect.objectContaining({ code: 123132 }),
        expect.objectContaining({ code: 123133 }),
        expect.objectContaining({ code: 123134 }),
      ],
    });
  });
});
