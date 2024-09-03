import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { ProjectFactory } from "test/factories/make-project";
import { BudgetFactory } from "test/factories/make-budget";
import { ContractFactory } from "test/factories/make-contract";
import { BaseFactory } from "test/factories/make-base";
import { MaterialFactory } from "test/factories/make-material";

describe("Fetch and Budget By Project Name (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let projectFactory: ProjectFactory;
  let budgetFactory: BudgetFactory;
  let contractFactory: ContractFactory;
  let baseFactory: BaseFactory;
  let materialFactory: MaterialFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StorekeeperFactory,
        BudgetFactory,
        ProjectFactory,
        BaseFactory,
        ContractFactory,
        MaterialFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    budgetFactory = moduleRef.get(BudgetFactory);
    projectFactory = moduleRef.get(ProjectFactory);
    baseFactory = moduleRef.get(BaseFactory);
    contractFactory = moduleRef.get(ContractFactory);
    materialFactory = moduleRef.get(MaterialFactory);

    await app.init();
  });

  test("[GET] /budgets", async () => {
    const contract = await contractFactory.makeBqContract({});
    const base = await baseFactory.makeBqBase({ contractId: contract.id });

    const user = await storekeeperFactory.makeBqStorekeeper({
      baseId: base.id,
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      type: "Administrador",
      baseId: base.id.toString(),
    });

    const material = await materialFactory.makeBqMaterial({
      contractId: contract.id,
    });

    const project = await projectFactory.makeBqProject({
      project_number: "B-teste",
      baseId: base.id,
    });

    await budgetFactory.makeBqBudget({
      projectId: project.id,
      contractId: contract.id,
      materialId: material.id,
    });
    await budgetFactory.makeBqBudget({
      projectId: project.id,
      contractId: contract.id,
      materialId: material.id,
    });
    await budgetFactory.makeBqBudget({
      projectId: project.id,
      contractId: contract.id,
      materialId: material.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/budgets?project_number=${project.project_number}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.budgets).toHaveLength(3);
  });
});
