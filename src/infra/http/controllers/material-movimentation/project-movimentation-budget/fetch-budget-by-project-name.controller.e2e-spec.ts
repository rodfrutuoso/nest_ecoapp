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

describe("Fetch and Budget By Project Name (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let projectFactory: ProjectFactory;
  let budgetFactory: BudgetFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StorekeeperFactory, BudgetFactory, ProjectFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    budgetFactory = moduleRef.get(BudgetFactory);
    projectFactory = moduleRef.get(ProjectFactory);

    await app.init();
  });

  test("[GET] /budgets", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const project = await projectFactory.makeBqProject({
      project_number: "B-teste",
    });

    await budgetFactory.makeBqBudget({ projectId: project.id });
    await budgetFactory.makeBqBudget({ projectId: project.id });
    await budgetFactory.makeBqBudget({ projectId: project.id });

    const response = await request(app.getHttpServer())
      .get("/budgets")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ project_number: "B-teste" });

    expect(response.statusCode).toBe(200);
    expect(response.body.budgets).toHaveLength(3);
  });
});
