import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { BaseFactory } from "test/factories/make-base";
import { ContractFactory } from "test/factories/make-contract";
import { EstimatorFactory } from "test/factories/make-estimator";

describe("Edit account (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let estimatorFactory: EstimatorFactory;
  let baseFactory: BaseFactory;
  let contractFactory: ContractFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StorekeeperFactory,
        BaseFactory,
        ContractFactory,
        EstimatorFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    baseFactory = moduleRef.get(BaseFactory);
    contractFactory = moduleRef.get(ContractFactory);
    estimatorFactory = moduleRef.get(EstimatorFactory);

    await app.init();
  });

  test("[PUT] /accounts:id - storekeeper", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({
      type: "Administrador",
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      type: user.type,
      baseId: user.baseId.toString(),
      contractId: user.contractId.toString(),
    });
    const base = await baseFactory.makeBqBase();

    const response = await request(app.getHttpServer())
      .put(`/accounts/${user.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        password: "123456",
        type: "Administrador",
        baseId: base.id.toString(),
      });

    const [userDataBase] = await bigquery.user.select({
      where: { email: user.email },
    });

    expect(response.statusCode).toBe(201);
    expect(userDataBase.baseId).toEqual(base.id.toString());
  });

  test("[PUT] /accounts:id - estimator", async () => {
    const user = await estimatorFactory.makeBqEstimator({
      type: "Orçamentista",
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      type: user.type,
      baseId: user.baseId.toString(),
      contractId: user.contractId.toString(),
    });
    const contract = await contractFactory.makeBqContract();

    const response = await request(app.getHttpServer())
      .put(`/accounts/${user.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        password: "123456",
        contractId: contract.id.toString(),
      });

    const [userDataBase] = await bigquery.user.select({
      where: { email: user.email },
    });

    expect(response.statusCode).toBe(201);
    expect(userDataBase.contractId).toEqual(contract.id.toString());
  });
});
