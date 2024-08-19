import { INestApplication } from "@nestjs/common";
import { AppModule } from "src/infra/app.module";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BigQueryService } from "src/infra/database/bigquery/bigquery.service";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { StorekeeperFactory } from "test/factories/make-storekeeper";
import { MovimentationFactory } from "test/factories/make-movimentation";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { DatabaseModule } from "src/infra/database/database.module";

describe("Fetch Movimentation History (E2E)", () => {
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

  test("[GET] /movimentations", async () => {
    const user = await storekeeperFactory.makeBqStorekeeper({});

    const accessToken = jwt.sign({ sub: user.id.toString() });
    const baseId = randomUUID();

    await movimentationFactory.makeBqMovimentation({
      materialId: new UniqueEntityID("material1"),
      baseId: new UniqueEntityID(baseId),
    });

    await movimentationFactory.makeBqMovimentation({
      materialId: new UniqueEntityID("material2"),
      baseId: new UniqueEntityID(baseId),
    });

    await movimentationFactory.makeBqMovimentation({
      materialId: new UniqueEntityID("material3"),
      baseId: new UniqueEntityID(baseId),
    });

    const response = await request(app.getHttpServer())
      .get("/movimentations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ baseId });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      movimentations: expect.arrayContaining([
        expect.objectContaining({ materialId: "material1" }),
        expect.objectContaining({ materialId: "material2" }),
        expect.objectContaining({ materialId: "material3" }),
      ]),
    });
  });
});
