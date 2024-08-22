import { beforeEach, describe, expect, it } from "vitest";
import { FetchStorekeeperUseCase } from "./fetch-storekeeper";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { makeStorekeeper } from "../../../../../../test/factories/make-storekeeper";
import { UniqueEntityID } from "../../../../../core/entities/unique-entity-id";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeContract } from "test/factories/make-contract";
import { makeBase } from "test/factories/make-base";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryContractRepository: InMemoryContractRepository;
let sut: FetchStorekeeperUseCase;

describe("Fetch Storekeepers History", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository(
      inMemoryBaseRepository
    );
    sut = new FetchStorekeeperUseCase(inMemoryStorekeeperRepository);
  });

  it("should be able to fetch physical documents history sorting by name", async () => {
    const contract = makeContract({ contractName: "Centro-Oeste" });
    inMemoryContractRepository.create(contract);

    const base = makeBase({ baseName: "Itaberaba" });
    inMemoryBaseRepository.create(base);

    const newStorekeeper1 = makeStorekeeper({
      name: "Bruno",
      baseId: base.id,
    });
    const newStorekeeper2 = makeStorekeeper({
      name: "Ana",
      baseId: base.id,
    });
    const newStorekeeper3 = makeStorekeeper({
      name: "Carlos",
      baseId: base.id,
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
    const contract = makeContract({ contractName: "Centro-Oeste" });
    inMemoryContractRepository.create(contract);

    const base = makeBase({ baseName: "Itaberaba" });
    inMemoryBaseRepository.create(base);

    for (let i = 1; i <= 45; i++) {
      await inMemoryStorekeeperRepository.create(
        makeStorekeeper({ baseId: base.id })
      );
    }

    const result = await sut.execute({
      page: 2,
    });
    if (result.isRight()) expect(result.value.storekeepers).toHaveLength(5);
  });

  it("should be able to fetch storekeepers history by base", async () => {
    const contract1 = makeContract({ contractName: "Centro-Oeste" });
    inMemoryContractRepository.create(contract1);

    const base1 = makeBase({ baseName: "Itaberaba" });
    inMemoryBaseRepository.create(base1);

    const contract2 = makeContract({ contractName: "Centro-Oeste" });
    inMemoryContractRepository.create(contract2);

    const base2 = makeBase({ baseName: "Itaberaba" });
    inMemoryBaseRepository.create(base2);

    const newStorekeeper1 = makeStorekeeper({
      baseId: base1.id,
    });
    const newStorekeeper2 = makeStorekeeper({
      baseId: base1.id,
    });
    const newStorekeeper3 = makeStorekeeper({
      baseId: base2.id,
    });

    await inMemoryStorekeeperRepository.create(newStorekeeper1);
    await inMemoryStorekeeperRepository.create(newStorekeeper2);
    await inMemoryStorekeeperRepository.create(newStorekeeper3);

    const result = await sut.execute({
      page: 1,
      baseId: base1.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight()) expect(result.value.storekeepers).toHaveLength(2);
  });
});
