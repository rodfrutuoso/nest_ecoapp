import { beforeEach, describe, expect, it } from "vitest";
import { GetAccountByidUseCase } from "./get-storekeeper-by-id";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { makeStorekeeper } from "../../../../../../test/factories/make-storekeeper";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeBase } from "test/factories/make-base";

let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let sut: GetAccountByidUseCase;

describe("Fetch Storekeepers History", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository(
      inMemoryBaseRepository
    );
    sut = new GetAccountByidUseCase(inMemoryStorekeeperRepository);
  });

  it("should be able to fetch physical documents history sorting by name", async () => {
    const base = makeBase();
    await inMemoryBaseRepository.create(base);

    const newStorekeeper1 = makeStorekeeper({
      email: "rodrigo@ecoeletrica.com.br",
      baseId: base.id,
    });

    await inMemoryStorekeeperRepository.create(newStorekeeper1);

    const result = await sut.execute({
      storekeeperId: newStorekeeper1.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.storekeeper.storekeeperId).toEqual(
        newStorekeeper1.id
      );
  });
});
