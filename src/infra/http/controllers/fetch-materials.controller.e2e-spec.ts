import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/bigquery/bigquery.service";
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";

describe("Fetch Materials (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /materials", async () => {
    await bigquery.user.create([
      {
        name: "Joao da Pilotinha",
        email: "joaopilotinha@ecoeletrica.com.br",
        password: await hash("123456", 8),
      },
    ]);

    const [user] = await bigquery.user.select({
      where: { email: "joaopilotinha@ecoeletrica.com.br" },
    });

    const accessToken = jwt.sign({ sub: user.id });
    const contractId = randomUUID();

    await bigquery.material.create([
      {
        code: 123132,
        description: "material de teste 1",
        type: "concreto",
        unit: "CDA",
        contractId: contractId,
      },
      {
        code: 123133,
        description: "material de teste 2",
        type: "concreto",
        unit: "CDA",
        contractId: contractId,
      },
      {
        code: 123134,
        description: "material de teste 3",
        type: "concreto",
        unit: "CDA",
        contractId: contractId,
      },
    ]);

    const response = await request(app.getHttpServer())
      .get("/materials")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ contractId, type: "concreto" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      materials: [
        expect.objectContaining({ code: "123132" }),
        expect.objectContaining({ code: "123133" }),
        expect.objectContaining({ code: "123134" }),
      ],
    });
  });
});
