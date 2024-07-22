import { beforeEach, describe, expect, it } from "vitest";
import { FetchMovimentationHistoryUseCase } from "./fetch-movimentations-history";
import { InMemoryMovimentationRepository } from "../../../../../../test/repositories/in-memory-movimentation-repository";
import { makeMovimentation } from "../../../../../../test/factories/make-movimentation";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";

let inMemoryMovimentationRepository: InMemoryMovimentationRepository;
let sut: FetchMovimentationHistoryUseCase;

describe("Fetch Movimentations History", () => {
  beforeEach(() => {
    inMemoryMovimentationRepository = new InMemoryMovimentationRepository();
    sut = new FetchMovimentationHistoryUseCase(inMemoryMovimentationRepository);
  });

  it("should be able to fetch movimentations history sorting by date", async () => {
    const newMovimentation1 = makeMovimentation({
      createdAt: new Date(2024, 5, 17),
      baseID: new UniqueEntityID("base-1"),
    });
    const newMovimentation2 = makeMovimentation({
      createdAt: new Date(2024, 5, 19),
      baseID: new UniqueEntityID("base-1"),
    });
    const newMovimentation3 = makeMovimentation({
      createdAt: new Date(2024, 5, 16),
      baseID: new UniqueEntityID("base-1"),
    });

    await inMemoryMovimentationRepository.create(newMovimentation1);
    await inMemoryMovimentationRepository.create(newMovimentation2);
    await inMemoryMovimentationRepository.create(newMovimentation3);

    const result = await sut.execute({
      page: 1,
      baseID: "base-1"
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.movimentations).toEqual([
        expect.objectContaining({
          props: expect.objectContaining({ createdAt: new Date(2024, 5, 19) }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ createdAt: new Date(2024, 5, 17) }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ createdAt: new Date(2024, 5, 16) }),
        }),
      ]);
  });

  it("should be able to fetch paginated movimentations history", async () => {
    for (let i = 1; i <= 45; i++) {
      await inMemoryMovimentationRepository.create(makeMovimentation({baseID: new UniqueEntityID("base-1")}));
    }

    const result = await sut.execute({
      page: 2,
      baseID: "base-1"
    });
    if (result.isRight()) expect(result.value.movimentations).toHaveLength(5);
  });
  
  it("should be able to fetch movimentations history by project", async () => {
    const newMovimentation1 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      projectId: new UniqueEntityID("projeto-1")
    });
    const newMovimentation2 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      projectId: new UniqueEntityID("projeto-1")
    });
    const newMovimentation3 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      projectId: new UniqueEntityID("projeto-2")
    });

    await inMemoryMovimentationRepository.create(newMovimentation1);
    await inMemoryMovimentationRepository.create(newMovimentation2);
    await inMemoryMovimentationRepository.create(newMovimentation3);

    const result = await sut.execute({
      page: 1,
      baseID: "base-1",
      projectId: "projeto-1"
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.movimentations).toHaveLength(2)
  });

  it("should be able to fetch movimentations history by material", async () => {
    const newMovimentation1 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      materialId: new UniqueEntityID("material-1")
    });
    const newMovimentation2 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      materialId: new UniqueEntityID("material-1")
    });
    const newMovimentation3 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      materialId: new UniqueEntityID("material-2")
    });

    await inMemoryMovimentationRepository.create(newMovimentation1);
    await inMemoryMovimentationRepository.create(newMovimentation2);
    await inMemoryMovimentationRepository.create(newMovimentation3);

    const result = await sut.execute({
      page: 1,
      baseID: "base-1",
      materialId: "material-1"
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.movimentations).toHaveLength(2)
  });

  it("should be able to fetch movimentations history by storkeeper", async () => {
    const newMovimentation1 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      storekeeperId: new UniqueEntityID("storekeeper-1")
    });
    const newMovimentation2 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      storekeeperId: new UniqueEntityID("storekeeper-1")
    });
    const newMovimentation3 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      storekeeperId: new UniqueEntityID("storekeeper-2")
    });

    await inMemoryMovimentationRepository.create(newMovimentation1);
    await inMemoryMovimentationRepository.create(newMovimentation2);
    await inMemoryMovimentationRepository.create(newMovimentation3);

    const result = await sut.execute({
      page: 1,
      baseID: "base-1",
      storekeeperId: "storekeeper-1"
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.movimentations).toHaveLength(2)
  });

  it("should be able to fetch movimentations history by a range of dates", async () => {
    const newMovimentation1 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      createdAt: new Date(2024, 5, 18),
    });
    const newMovimentation2 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      createdAt: new Date(2024, 5, 15),
    });
    const newMovimentation3 = makeMovimentation({
      baseID: new UniqueEntityID("base-1"),
      createdAt: new Date(2024, 5, 13),
    });

    await inMemoryMovimentationRepository.create(newMovimentation1);
    await inMemoryMovimentationRepository.create(newMovimentation2);
    await inMemoryMovimentationRepository.create(newMovimentation3);

    const result = await sut.execute({
      page: 1,
      baseID: "base-1",
      startDate: new Date(2024,5,13),
      endDate: new Date(2024,5,16)
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.movimentations).toHaveLength(2)
  });
});
