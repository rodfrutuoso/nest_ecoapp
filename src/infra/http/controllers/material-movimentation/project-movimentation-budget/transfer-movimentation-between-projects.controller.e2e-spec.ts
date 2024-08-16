import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { DatabaseModule } from "src/infra/database/database.module";
import { randomUUID } from "crypto";
import { MovimentationFactory } from "test/factories/make-movimentation";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { BqMovimentationProps } from "src/infra/database/bigquery/schemas/movimentation";

describe("Transfer Movimentation Between Projects (E2E)", () => {
  let app: INestApplication;
  let bigquery: BigQueryService;
  let jwt: JwtService;
  let storekeeperFactory: StorekeeperFactory;
  let movimentationFactory: MovimentationFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StorekeeperFactory, MovimentationFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    bigquery = moduleRef.get(BigQueryService);
    jwt = moduleRef.get(JwtService);
    storekeeperFactory = moduleRef.get(StorekeeperFactory);
    movimentationFactory = moduleRef.get(MovimentationFactory);

    await app.init();
  });

  test("[POST] /transfer-movimentation", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const projectIdOut = randomUUID();
    const projectIdIn = randomUUID();
    const baseId = randomUUID();
    const materialId1 = randomUUID();
    const materialId2 = randomUUID();
    const materialId3 = randomUUID();

    await movimentationFactory.makeBqMovimentation({
      projectId: new UniqueEntityID(projectIdOut),
      materialId: new UniqueEntityID(materialId1),
      baseId: new UniqueEntityID(baseId),
      value: 5,
    });

    await movimentationFactory.makeBqMovimentation({
      projectId: new UniqueEntityID(projectIdOut),
      materialId: new UniqueEntityID(materialId2),
      baseId: new UniqueEntityID(baseId),
      value: 6,
    });

    await movimentationFactory.makeBqMovimentation({
      projectId: new UniqueEntityID(projectIdOut),
      materialId: new UniqueEntityID(materialId3),
      baseId: new UniqueEntityID(baseId),
      value: 10,
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/transfer-movimentation")
      .set("Authorization", `Bearer ${accessToken}`)
      .send([
        {
          materialId: materialId1,
          projectIdOut,
          projectIdIn,
          observation: "observação 1",
          baseId,
          value: 4,
        },
        {
          materialId: materialId2,
          projectIdOut,
          projectIdIn,
          observation: "observação 2",
          baseId,
          value: 6,
        },
        {
          materialId: materialId3,
          projectIdOut,
          projectIdIn,
          observation: "observação 3",
          baseId,
          value: 8,
        },
      ]);

    let movimentationDataBaseOut = await bigquery.movimentation.select({
      where: { projectId: projectIdOut },
    });
    const movimentationDataBaseIn = await bigquery.movimentation.select({
      where: { projectId: projectIdIn },
    });

    movimentationDataBaseOut = movimentationDataBaseOut.reduce((a, b) => {
      const existingMaterial = a.find(
        (item) => item.materialId === b.materialId
      );

      if (existingMaterial) {
        existingMaterial.value += b.value;
      } else {
        a.push({ ...b });
      }

      return a;
    }, [] as BqMovimentationProps[]);

    expect(response.statusCode).toBe(201);
    expect(movimentationDataBaseOut).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ materialId: materialId1, value: 1 }),
        expect.objectContaining({ materialId: materialId2, value: 0 }),
        expect.objectContaining({ materialId: materialId3, value: 2 }),
      ])
    );
    expect(movimentationDataBaseIn).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ materialId: materialId1, value: 4 }),
        expect.objectContaining({ materialId: materialId2, value: 6 }),
        expect.objectContaining({ materialId: materialId3, value: 8 }),
      ])
    );
  });
});
