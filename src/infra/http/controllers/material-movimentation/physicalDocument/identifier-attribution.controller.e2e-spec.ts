import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { UserFactory } from "test/factories/make-user";
import { DatabaseModule } from "src/infra/database/database.module";
import { ProjectFactory } from "test/factories/make-project";

describe("Identifier Attribution (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let projectFactory: ProjectFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProjectFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);
    projectFactory = moduleRef.get(ProjectFactory);

    await app.init();
  });

  test("[POST] /physical-documents", async () => {
    const user = await userFactory.makeBqUser({});

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      type: user.type,
      baseId: user.baseId.toString(),
      contractId: user.contractId.toString(),
    });

    const project = await projectFactory.makeBqProject({ baseId: user.baseId });

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

    // console.log(project.id.toString());
    // console.log(response.headers);
    // console.log(response.text);
    // console.log(response.body.errors.details);
    // console.log(physicalDocumentDataBase);

    expect(response.statusCode).toBe(201);
    expect(physicalDocumentDataBase.identifier).toEqual(2);
  });
});
