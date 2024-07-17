import { beforeEach, describe, expect, it } from "vitest";
import { FetchStorekeeperUseCase } from "./fetch-storekeeper";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { makeStorekeeper } from "../../../../../../test/factories/make-storekeeper";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let sut: FetchStorekeeperUseCase;

describe("Fetch Storekeepers History", () => {
  beforeEach(() => {
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository();
    sut = new FetchStorekeeperUseCase(inMemoryStorekeeperRepository);
  });

  it("should be able to fetch physical documents history sorting by name", async () => {
    const newStorekeeper1 = makeStorekeeper({
      name: "Bruno",
    });
    const newStorekeeper2 = makeStorekeeper({
      name: "Ana",
    });
    const newStorekeeper3 = makeStorekeeper({
      name: "Carlos",
    });

    await inMemoryStorekeeperRepository.create(newStorekeeper1);
    await inMemoryStorekeeperRepository.create(newStorekeeper2);
    await inMemoryStorekeeperRepository.create(newStorekeeper3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.storekeepers).toEqual([
        expect.objectContaining({
          props: expect.objectContaining({ name: "Ana" }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ name: "Bruno" }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ name: "Carlos" }),
        }),
      ]);
  });

  it("should be able to fetch paginated storekeepers history", async () => {
    for (let i = 1; i <= 45; i++) {
      await inMemoryStorekeeperRepository.create(makeStorekeeper());
    }

    const result = await sut.execute({
      page: 2,
    });
    if (result.isRight()) expect(result.value.storekeepers).toHaveLength(5);
  });
  
  it("should be able to fetch storekeepers history by base", async () => {
    const newStorekeeper1 = makeStorekeeper({
      baseId: new UniqueEntityID("base-1")
    });
    const newStorekeeper2 = makeStorekeeper({
      baseId: new UniqueEntityID("base-1")
    });
    const newStorekeeper3 = makeStorekeeper({
      baseId: new UniqueEntityID("base-2")
    });

    await inMemoryStorekeeperRepository.create(newStorekeeper1);
    await inMemoryStorekeeperRepository.create(newStorekeeper2);
    await inMemoryStorekeeperRepository.create(newStorekeeper3);

    const result = await sut.execute({
      page: 1,
      baseId: "base-1"
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.storekeepers).toHaveLength(2)
  });
});
