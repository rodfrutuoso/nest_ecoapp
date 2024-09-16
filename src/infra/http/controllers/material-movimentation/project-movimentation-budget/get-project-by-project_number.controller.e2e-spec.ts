import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { MovimentationFactory } from "test/factories/make-movimentation";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { DatabaseModule } from "src/infra/database/database.module";
import { MaterialFactory } from "test/factories/make-material";
import { ContractFactory } from "test/factories/make-contract";
import { ProjectFactory } from "test/factories/make-project";
import { BaseFactory } from "test/factories/make-base";

describe("Fetch Movimentation History (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let contractFactory: ContractFactory;
  let projectFactory: ProjectFactory;
  let baseFactory: BaseFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StorekeeperFactory,
        ContractFactory,
        BaseFactory,
        ProjectFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    contractFactory = moduleRef.get(ContractFactory);
    projectFactory = moduleRef.get(ProjectFactory);
    baseFactory = moduleRef.get(BaseFactory);

    await app.init();
  });

  test("[GET] /projects", async () => {
    const contract = await contractFactory.makeBqContract();
    const base = await baseFactory.makeBqBase({ contractId: contract.id });
    const user = await storekeeperFactory.makeBqStorekeeper({
      contractId: contract.id,
      baseId: base.id,
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      type: user.type,
      baseId: user.baseId.toString(),
      contractId: user.contractId.toString(),
    });

    await projectFactory.makeBqProject({
      project_number: "B-test-project",
      baseId: base.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/projects?project_nummber=B-test-project`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    console.log(response.headers);
    console.log(response.text);
    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      project: expect.objectContaining({
        project_number: "B-test-project",
      }),
    });
  });
});
