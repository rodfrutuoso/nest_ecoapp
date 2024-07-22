import { beforeEach, describe, expect, it, test } from "vitest";
import { EditStorekeeperUseCase } from "./edit-storekeeper";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { makeStorekeeper } from "../../../../../../test/factories/make-storekeeper";

let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let sut: EditStorekeeperUseCase;

describe("Edit Storekeeper", () => {
  beforeEach(() => {
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository();
    sut = new EditStorekeeperUseCase(inMemoryStorekeeperRepository);
  });

  it("sould be able to edit a storekeeper", async () => {
    const storekeeper = makeStorekeeper();
    const author = makeStorekeeper({ type: "Administrator" });

    await inMemoryStorekeeperRepository.create(author);
    await inMemoryStorekeeperRepository.create(storekeeper);

    await sut.execute({
      authorId: author.id.toString(),
      storekeeperId: storekeeper.id.toString(),
      baseId: "Vitória da Conquista",
    });

    expect(inMemoryStorekeeperRepository.items[1]).toMatchObject({
      props: {
        baseId: "Vitória da Conquista",
      },
    });
  });

  it("sould not be able to edit a storekeeper if the author is not 'Administrador'", async () => {
    const storekeeper = makeStorekeeper();
    const author = makeStorekeeper({ type: "Almoxarife" });

    await inMemoryStorekeeperRepository.create(author);
    await inMemoryStorekeeperRepository.create(storekeeper);

    const result = await sut.execute({
      authorId: author.id.toString(),
      storekeeperId: storekeeper.id.toString(),
      baseId: "Vitória da Conquista",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(inMemoryStorekeeperRepository.items[1].baseId).toEqual(
      storekeeper.baseId
    );
  });
});
