import { beforeEach, describe, expect, it, test } from "vitest";
import { EditStorekeeperUseCase } from "./edit-storekeeper";
import { InMemoryStorekeeperRepository } from "../../../../../../test/repositories/in-memory-storekeeper-repository";
import { makeStorekeeper } from "../../../../../../test/factories/make-storekeeper";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryBaseRepository } from "test/repositories/in-memory-base-repository";
import { InMemoryContractRepository } from "test/repositories/in-memory-contract-repository";
import { makeBase } from "test/factories/make-base";
import { makeContract } from "test/factories/make-contract";

let inMemoryContractRepository: InMemoryContractRepository;
let inMemoryBaseRepository: InMemoryBaseRepository;
let inMemoryStorekeeperRepository: InMemoryStorekeeperRepository;
let sut: EditStorekeeperUseCase;
let fakeHasher: FakeHasher;

describe("Edit Storekeeper", () => {
  beforeEach(() => {
    inMemoryContractRepository = new InMemoryContractRepository();
    inMemoryBaseRepository = new InMemoryBaseRepository(
      inMemoryContractRepository
    );
    inMemoryStorekeeperRepository = new InMemoryStorekeeperRepository(
      inMemoryBaseRepository
    );
    fakeHasher = new FakeHasher();
    sut = new EditStorekeeperUseCase(
      inMemoryStorekeeperRepository,
      fakeHasher,
      inMemoryBaseRepository
    );
  });

  it("sould be able to edit a storekeeper", async () => {
    const base = makeBase({}, new UniqueEntityID("Vitória da Conquista"));
    await inMemoryBaseRepository.create(base);

    const storekeeper = makeStorekeeper();
    const author = makeStorekeeper({ type: "Administrador" });

    await inMemoryStorekeeperRepository.create(author);
    await inMemoryStorekeeperRepository.create(storekeeper);

    await sut.execute({
      authorId: author.id.toString(),
      storekeeperId: storekeeper.id.toString(),
      baseId: "Vitória da Conquista",
      password: "123456",
    });

    expect(inMemoryStorekeeperRepository.items[1]).toMatchObject({
      props: {
        baseId: new UniqueEntityID("Vitória da Conquista"),
      },
    });
    expect(
      await fakeHasher.compare(
        "123456",
        inMemoryStorekeeperRepository.items[1].password
      )
    ).toBe(true);
  });

  it("sould not be able to edit a storekeeper if the author is not 'Administrador'", async () => {
    const base = makeBase({}, new UniqueEntityID("Vitória da Conquista"));
    await inMemoryBaseRepository.create(base);

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

  it("sould be able to edit a storekeeper changing contractId by changing baseId", async () => {
    const contract1 = makeContract({ contractName: "Sudoeste" });
    await inMemoryContractRepository.create(contract1);
    const contract2 = makeContract({contractName: "Pernambuco"});
    await inMemoryContractRepository.create(contract2);

    const base1 = makeBase(
      { contractId: contract1.id },
      new UniqueEntityID("Vitória da Conquista")
    );
    await inMemoryBaseRepository.create(base1);
    const base2 = makeBase(
      { contractId: contract2.id },
      new UniqueEntityID("Petrolina")
    );
    await inMemoryBaseRepository.create(base2);

    const storekeeper = makeStorekeeper();
    const author = makeStorekeeper({ type: "Administrador" });

    await inMemoryStorekeeperRepository.create(author);
    await inMemoryStorekeeperRepository.create(storekeeper);

    await sut.execute({
      authorId: author.id.toString(),
      storekeeperId: storekeeper.id.toString(),
      baseId: "Petrolina",
    });

    expect(inMemoryStorekeeperRepository.items[1]).toMatchObject({
      props: {
        baseId: new UniqueEntityID("Petrolina"),
        contracitId: new UniqueEntityID("Pernumabuco"),
      },
    });
  });
});
