import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";

describe("Register Material (E2E)", () => {
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

  test("[POST] /materials", async () => {
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

    const response = await request(app.getHttpServer())
      .post("/materials")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        code: 123132,
        description: "material de teste",
        type: "concreto",
        unit: "CDA",
        contractId: randomUUID(),
      });

    const [MaterialDataBase] = await bigquery.material.select({
      where: { code: 123132 },
    });

    expect(response.statusCode).toBe(201);
    expect(MaterialDataBase.description).toEqual("material de teste");
  });
});
