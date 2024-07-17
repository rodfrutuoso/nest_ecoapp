import { beforeEach, describe, expect, it } from "vitest";
import { GetStorekeeperByEmailUseCase } from "./get-storekeeper-by-email";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { makeStorekeeper } from "../../../../../../test/factories/make-storekeeper";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let sut: GetStorekeeperByEmailUseCase;

describe("Fetch Storekeepers History", () => {
  beforeEach(() => {
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository();
    sut = new GetStorekeeperByEmailUseCase(inMemoryStorekeeperRepository);
  });

  it("should be able to fetch physical documents history sorting by name", async () => {
    const newStorekeeper1 = makeStorekeeper({
      email: "rodrigo@ecoeletrica.com.br",
    });

    await inMemoryStorekeeperRepository.create(newStorekeeper1);

    const result = await sut.execute({
      email: "rodrigo@ecoeletrica.com.br",
    });

    expect(result.isRight()).toBeTruthy();
    if (result.isRight())
      expect(result.value.storekeepers.email).toEqual("rodrigo@ecoeletrica.com.br");
  });
});
