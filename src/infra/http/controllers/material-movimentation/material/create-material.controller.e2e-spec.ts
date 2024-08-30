import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { ContractFactory } from "test/factories/make-contract";

describe("Create Material (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let contractFactory: ContractFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StorekeeperFactory, ContractFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    contractFactory = moduleRef.get(ContractFactory);

    await app.init();
  });

  test("[POST] /materials", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const contract = await contractFactory.makeBqContract({});

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/materials")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        code: 123132,
        description: "material de teste",
        type: "concreto",
        unit: "CDA",
        contractId: contract.id.toString(),
      });

    const [MaterialDataBase] = await bigquery.material.select({
      where: { code: 123132 },
    });

    expect(response.statusCode).toBe(201);
    expect(MaterialDataBase.description).toEqual("material de teste");
  });
});
