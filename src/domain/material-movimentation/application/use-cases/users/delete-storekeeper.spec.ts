import { beforeEach, describe, expect, it } from "vitest";
import { DeleteStorekeeperUseCase } from "./delete-storekeeper";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { makeStorekeeper } from "../../../../../../test/factories/make-storekeeper";
import { NotAllowedError } from "../errors/not-allowed-error";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";

let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let sut: DeleteStorekeeperUseCase;

describe("Delete Storekeeper", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository(
      inMemoryBaseRepository
    );
    sut = new DeleteStorekeeperUseCase(inMemoryStorekeeperRepository);
  });

  it("sould be able to delete a storekeeper", async () => {
    const storekeeper = makeStorekeeper();
    const author = makeStorekeeper({ type: "Administrador" });

    await inMemoryStorekeeperRepository.create(author);
    await inMemoryStorekeeperRepository.create(storekeeper);

    const result = await sut.execute({
      authorType: author.type,
      storekeeperId: storekeeper.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryStorekeeperRepository.items).toHaveLength(1); // there'll be only the author
  });

  it("sould not be able to delete a storekeeper if the author is not 'Administrador'", async () => {
    const storekeeper = makeStorekeeper();
    const author = makeStorekeeper({ type: "Almoxarife" });

    await inMemoryStorekeeperRepository.create(author);
    await inMemoryStorekeeperRepository.create(storekeeper);

    const result = await sut.execute({
      authorType: author.type,
      storekeeperId: storekeeper.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryStorekeeperRepository.items).toHaveLength(2);
  });
});
