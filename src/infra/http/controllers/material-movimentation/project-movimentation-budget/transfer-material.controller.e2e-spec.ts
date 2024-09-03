import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { ProjectFactory } from "test/factories/make-project";
import { BaseFactory } from "test/factories/make-base";
import { MaterialFactory } from "test/factories/make-material";

describe("Transfer Material (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let projectFactory: ProjectFactory;
  let baseFactory: BaseFactory;
  let materialFactory: MaterialFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StorekeeperFactory,
        MaterialFactory,
        BaseFactory,
        ProjectFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    materialFactory = moduleRef.get(MaterialFactory);
    baseFactory = moduleRef.get(BaseFactory);
    projectFactory = moduleRef.get(ProjectFactory);

    await app.init();
  });

  test("[POST] /movimentation", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      type: "Administrador",
    });

    const project = await projectFactory.makeBqProject();
    const base = await baseFactory.makeBqBase();
    const material = await materialFactory.makeBqMaterial();

    const response = await request(app.getHttpServer())
      .post("/movimentation")
      .set("Authorization", `Bearer ${accessToken}`)
      .send([
        {
          materialId: material.id.toString(),
          projectId: project.id.toString(),
          observation: "observação 1",
          baseId: base.id.toString(),
          value: 5,
        },
        {
          materialId: material.id.toString(),
          projectId: project.id.toString(),
          observation: "observação 2",
          baseId: base.id.toString(),
          value: 2,
        },
        {
          materialId: material.id.toString(),
          projectId: project.id.toString(),
          observation: "observação 3",
          baseId: base.id.toString(),
          value: -1,
        },
      ]);

    const movimentationDataBase = await bigquery.movimentation.select({
      where: { projectId: project.id.toString() },
    });

    expect(response.statusCode).toBe(201);
    expect(movimentationDataBase).toHaveLength(3);
  });
});
