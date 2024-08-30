import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { ProjectFactory } from "test/factories/make-project";

describe("Identifier Attribution (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let projectFactory: ProjectFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StorekeeperFactory, ProjectFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    projectFactory = moduleRef.get(ProjectFactory);

    await app.init();
  });

  test("[POST] /physical-documents", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const accessToken = jwt.sign({ sub: user.id.toString() });
    const project = await projectFactory.makeBqProject();

    const response = await request(app.getHttpServer())
      .post("/physical-documents")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        projectId: project.id.toString(),
        identifier: 2,
      });

    const [physicalDocumentDataBase] = await bigquery.physicalDocument.select({
      where: { identifier: 2 },
    });

    expect(response.statusCode).toBe(201);
    expect(physicalDocumentDataBase.identifier).toEqual(2);
  });
});
