import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { BaseFactory } from "test/factories/make-base";

describe("Register Project (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let baseFactory: BaseFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StorekeeperFactory, BaseFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    baseFactory = moduleRef.get(BaseFactory);

    await app.init();
  });

  test("[POST] /projects", async () => {
    const base = await baseFactory.makeBqBase();

    const user = await storekeeperFactory.makeBqStorekeeper({
      baseId: base.id,
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      type: "Administrador",
    });

    const response = await request(app.getHttpServer())
      .post("/projects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        project_number: "B-12345678",
        description: "MP-NUM-SEI-DAS-QUANTAS",
        type: "obra",
        baseId: base.id.toString(),
        city: "Ituí",
      });

    const [projectDataBase] = await bigquery.project.select({
      where: { project_number: "B-12345678" },
    });

    expect(response.statusCode).toBe(201);
    expect(projectDataBase.description).toEqual("MP-NUM-SEI-DAS-QUANTAS");
  });
});
